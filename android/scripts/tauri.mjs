import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const androidHome = process.env.ANDROID_HOME || join(homedir(), "Android", "Sdk");
const ndkRoot = join(androidHome, "ndk");
const ndkVersions = existsSync(ndkRoot)
    ? readdirSync(ndkRoot, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    : [];

const javaBinary = existsSync("/usr/bin/java") ? "/usr/bin/java" : join(process.env.JAVA_HOME || "", "bin", "java");
const javaHome =
    process.env.JAVA_HOME || dirname(dirname(realpathSync(javaBinary)));
const cargoBin = join(homedir(), ".cargo", "bin");

if (!existsSync(androidHome)) {
    throw new Error(`Android SDK was not found at ${androidHome}`);
}

if (!process.env.NDK_HOME && ndkVersions.length === 0) {
    throw new Error(`Android NDK was not found under ${ndkRoot}`);
}

const result = spawnSync("pnpm", ["exec", "tauri", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: {
        ...process.env,
        ANDROID_HOME: androidHome,
        ANDROID_SDK_ROOT: androidHome,
        NDK_HOME: process.env.NDK_HOME || join(ndkRoot, ndkVersions.at(-1)),
        JAVA_HOME: javaHome,
        PATH: `${cargoBin}:${join(androidHome, "platform-tools")}:${process.env.PATH}`,
    },
});

process.exit(result.status ?? 1);
