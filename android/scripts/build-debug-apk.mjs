import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
rmSync(join(root, "src-tauri", "gen", "android", "app", "src", "main", "jniLibs"), {
    recursive: true,
    force: true,
});

const build = spawnSync(
    process.execPath,
    [join(root, "scripts", "tauri.mjs"), "android", "build", "--apk", "--debug", "--target", "aarch64"],
    { cwd: root, stdio: "inherit" },
);

if (build.status !== 0) process.exit(build.status ?? 1);

const source = join(
    root,
    "src-tauri",
    "gen",
    "android",
    "app",
    "build",
    "outputs",
    "apk",
    "universal",
    "debug",
    "app-universal-debug.apk",
);
const destination = join(root, "artifacts", "PassMan-Android-debug.apk");

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
console.log(`Installable APK: ${destination}`);
