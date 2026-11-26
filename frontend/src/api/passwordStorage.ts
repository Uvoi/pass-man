import { invoke, isTauri } from "@tauri-apps/api/core";

import type { EncryptedPassItem } from "../types";

export type StoredPasswordItem = {
    id: number;
    encrypted_data: string;
    iv: string;
    salt: string;
    created_at: string;
};

export type PasswordStorage = {
    getAll: () => Promise<StoredPasswordItem[]>;
    create: (item: EncryptedPassItem) => Promise<void>;
    update: (item: EncryptedPassItem) => Promise<void>;
    delete: (id: number) => Promise<void>;
};

const request = async (path: string, init?: RequestInit) => {
    const response = await fetch(path, init);

    if (!response.ok) {
        throw new Error(`PassMan API request failed: ${response.status}`);
    }

    return response;
};

const toStoredItem = (item: EncryptedPassItem) => ({
    encrypted_data: item.data,
    iv: item.iv,
    salt: item.salt,
});

const httpPasswordStorage: PasswordStorage = {
    async getAll() {
        const response = await request("/api/password-items");

        return response.json();
    },

    async create(item) {
        await request("/api/password-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toStoredItem(item)),
        });
    },

    async update(item) {
        await request(`/api/password-items/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toStoredItem(item)),
        });
    },

    async delete(id) {
        await request(`/api/password-items/${id}`, { method: "DELETE" });
    },
};

const desktopPasswordStorage: PasswordStorage = {
    getAll: () => invoke<StoredPasswordItem[]>("list_password_items"),
    create: (item) => invoke("create_password_item", { item: toStoredItem(item) }),
    update: (item) =>
        invoke("update_password_item", {
            item: {
                id: item.id,
                ...toStoredItem(item),
            },
        }),
    delete: (id) => invoke("delete_password_item", { id }),
};

export const passwordStorage = isTauri() ? desktopPasswordStorage : httpPasswordStorage;
