import { chmod, cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const desktopDirectory = resolve(scriptDirectory, "..");
const bundleDirectory = resolve(
  desktopDirectory,
  "src-tauri/target/release/bundle",
);

const outputFlagIndex = process.argv.indexOf("--output");

if (outputFlagIndex >= 0 && !process.argv[outputFlagIndex + 1]) {
  throw new Error("--output requires a directory path");
}

const launchDirectory = process.env.INIT_CWD
  ? resolve(process.env.INIT_CWD)
  : desktopDirectory;
const outputDirectory = resolve(
  outputFlagIndex >= 0 ? process.argv[outputFlagIndex + 1] : launchDirectory,
);

const findArtifact = async (directory, suffix) => {
  const files = await readdir(directory);
  const file = files.find((name) => name.endsWith(suffix));

  if (!file) {
    throw new Error(`No ${suffix} artifact found in ${directory}`);
  }

  return resolve(directory, file);
};

const appImageDirectory = resolve(bundleDirectory, "appimage");
const debDirectory = resolve(bundleDirectory, "deb");

const artifacts = [
  {
    source: resolve(appImageDirectory, "PassMan.AppDir"),
    destination: resolve(outputDirectory, "PassMan.AppDir"),
    executable: false,
  },
  {
    source: await findArtifact(appImageDirectory, ".AppImage"),
    destination: resolve(outputDirectory, "PassMan.AppImage"),
    executable: true,
  },
  {
    source: await findArtifact(debDirectory, ".deb"),
    destination: resolve(outputDirectory, "PassMan.deb"),
    executable: false,
  },
];

await mkdir(outputDirectory, { recursive: true });

for (const artifact of artifacts) {
  const portableDataDirectory = join(artifact.destination, "PassMan.data");
  const portableDataBackup = resolve(
    outputDirectory,
    `.PassMan.data.${process.pid}.backup`,
  );
  let hasPortableDataBackup = false;

  if (artifact.destination.endsWith("PassMan.AppDir")) {
    try {
      await rename(portableDataDirectory, portableDataBackup);
      hasPortableDataBackup = true;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  try {
    await rm(artifact.destination, { recursive: true, force: true });
    await cp(artifact.source, artifact.destination, {
      recursive: true,
      dereference: true,
    });

    if (hasPortableDataBackup) {
      await rename(portableDataBackup, portableDataDirectory);
      hasPortableDataBackup = false;
    }
  } finally {
    if (hasPortableDataBackup) {
      await mkdir(artifact.destination, { recursive: true });
      await rename(portableDataBackup, portableDataDirectory);
    }
  }

  if (artifact.executable) {
    await chmod(artifact.destination, 0o755);
  }

  await rm(artifact.source, { recursive: true, force: true });
  console.log(`Exported ${artifact.destination}`);
}
