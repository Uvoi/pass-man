import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const desktopDirectory = resolve(scriptDirectory, "..");
const cacheDirectory = resolve(desktopDirectory, ".cache");
const temporaryDirectory = resolve(desktopDirectory, ".tmp");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

await Promise.all([
  mkdir(cacheDirectory, { recursive: true }),
  mkdir(temporaryDirectory, { recursive: true }),
]);

const run = (command, args) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: desktopDirectory,
      stdio: "inherit",
      env: {
        ...process.env,
        XDG_CACHE_HOME: cacheDirectory,
        TMPDIR: temporaryDirectory,
      },
    });

    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} exited with code ${code}`));
      }
    });
  });

await run(pnpm, ["exec", "tauri", "build"]);
await run(process.execPath, [
  resolve(scriptDirectory, "export-artifacts.mjs"),
  ...process.argv.slice(2),
]);
