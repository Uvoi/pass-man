import type {
    EncryptedData,
    EncryptedPassItem,
    PassItem,
} from "../types/pass";
import { encryptPassItems } from "../utils/crypto";


const API_URL = "";


export const mockMasterKeys: Record<number, string> = {
    0: "github-master",
    1: "gmail-master",
    2: "discord-master",
};


type ApiPasswordItem = {
    id: number;
    encrypted_data: string;
    iv: string;
    salt: string;
    created_at: string;
};


const toEncryptedPassItem = (
    item: ApiPasswordItem,
): EncryptedPassItem =>
{
    return {
        id: item.id,
        iv: item.iv,
        salt: item.salt,
        data: item.encrypted_data,
    };
};


const getPasswordItems = async (): Promise<ApiPasswordItem[]> =>
{
    const response = await fetch(
        `${API_URL}/api/password-items`,
    );

    if (!response.ok)
    {
        throw new Error(
            `Failed to load password items: ${response.status}`,
        );
    }

    return response.json();
};


export const getPassManData = async (): Promise<EncryptedData> =>
{
    const items = await getPasswordItems();

    return items.map(toEncryptedPassItem);
};


const createPasswordItem = async (
    item: EncryptedPassItem,
): Promise<void> =>
{
    const response = await fetch(
        `${API_URL}/api/password-items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                encrypted_data: item.data,
                iv: item.iv,
                salt: item.salt,
            }),
        },
    );

    if (!response.ok)
    {
        throw new Error(
            `Failed to create password item: ${response.status}`,
        );
    }
};


const updatePasswordItem = async (
    item: EncryptedPassItem,
): Promise<void> =>
{
    const response = await fetch(
        `${API_URL}/api/password-items/${item.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                encrypted_data: item.data,
                iv: item.iv,
                salt: item.salt,
            }),
        },
    );

    if (!response.ok)
    {
        throw new Error(
            `Failed to update password item: ${response.status}`,
        );
    }
};


const deletePasswordItem = async (
    id: number,
): Promise<void> =>
{
    const response = await fetch(
        `${API_URL}/api/password-items/${id}`,
        {
            method: "DELETE",
        },
    );

    if (!response.ok)
    {
        throw new Error(
            `Failed to delete password item: ${response.status}`,
        );
    }
};


export const savePassManData = async (
    data: EncryptedData,
): Promise<void> =>
{
    const existingItems = await getPasswordItems();

    const existingIds = new Set(
        existingItems.map(item => item.id),
    );

    const newIds = new Set(
        data.map(item => item.id),
    );

    await Promise.all(
        existingItems
            .filter(item => !newIds.has(item.id))
            .map(item => deletePasswordItem(item.id)),
    );

    await Promise.all(
        data.map(item =>
        {
            if (existingIds.has(item.id))
            {
                return updatePasswordItem(item);
            }

            return createPasswordItem(item);
        }),
    );
};

export const addPassManItem = async (
    item: PassItem,
    managerPassword: string,
): Promise<void> =>
{
    const encrypted = await encryptPassItems(
        [item],
        managerPassword,
    );

    await createPasswordItem(
        encrypted[0],
    );
};
