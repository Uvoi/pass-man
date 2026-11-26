import type { EncryptedData, EncryptedPassItem, PassItem } from "../types";
import { encryptPassItems } from "../utils";
import { passwordStorage, type StoredPasswordItem } from "./passwordStorage";

export const mockMasterKeys: Record<number, string> = {
    0: "github-master",
    1: "gmail-master",
    2: "discord-master",
};

const toEncryptedPassItem = (item: StoredPasswordItem): EncryptedPassItem => {
    return {
        id: item.id,
        iv: item.iv,
        salt: item.salt,
        data: item.encrypted_data,
    };
};

const getPasswordItems = () => passwordStorage.getAll();

export const getPassManData = async (): Promise<EncryptedData> => {
    const items = await getPasswordItems();

    return items.map(toEncryptedPassItem);
};

const createPasswordItem = async (item: EncryptedPassItem): Promise<void> => {
    await passwordStorage.create(item);
};

const updatePasswordItem = async (item: EncryptedPassItem): Promise<void> => {
    await passwordStorage.update(item);
};

const deletePasswordItem = async (id: number): Promise<void> => {
    await passwordStorage.delete(id);
};

export const savePassManData = async (data: EncryptedData): Promise<void> => {
    const existingItems = await getPasswordItems();

    const existingIds = new Set(existingItems.map((item) => item.id));

    const newIds = new Set(data.map((item) => item.id));

    await Promise.all(
        existingItems
            .filter((item) => !newIds.has(item.id))
            .map((item) => deletePasswordItem(item.id)),
    );

    await Promise.all(
        data.map((item) => {
            if (existingIds.has(item.id)) {
                return updatePasswordItem(item);
            }

            return createPasswordItem(item);
        }),
    );
};

export const addPassManItem = async (item: PassItem, managerPassword: string): Promise<void> => {
    const encrypted = await encryptPassItems([item], managerPassword);

    await createPasswordItem(encrypted[0]);
};
