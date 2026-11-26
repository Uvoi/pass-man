import { invoke, isTauri } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export const isNativeApp = isTauri();

const backupFilters = [{ name: "PassMan backup", extensions: ["passman"] }];

export const exportNativeBackup = async () => {
    const contents = await invoke<string>("export_password_items");
    const path = await save({
        defaultPath: `passman-backup-${new Date().toISOString().slice(0, 10)}.passman`,
        filters: backupFilters,
    });

    if (!path) return false;

    await writeTextFile(path, contents);
    return true;
};

export const importNativeBackup = async () => {
    const path = await open({ multiple: false, directory: false, filters: backupFilters });

    if (!path) return null;

    const contents = await readTextFile(path);
    return invoke<number>("import_password_items", { contents });
};
