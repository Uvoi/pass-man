

import type { EncryptedData, PassItem } from "../types/pass";
import {
    encryptPassItems,
} from "../utils/crypto";

const MOCK_MANAGER_PASSWORD = "manager123";

export const mockMasterKeys: Record<number, string> = {
    0: "github-master",
    1: "gmail-master",
    2: "discord-master",
};

const mockItems: PassItem[] = [
    {
        id: 0,

        key: "github",

        tag: "personal",

        params: {
            iterations: 3,
            memorySize: 65536,
            hashLength: 16,

            selectedGroups: {
                letters: true,
                digits: true,
                special: true,
            },

            charsetGroups: {
                letters:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",

                digits:
                    "0123456789",

                special:
                    "!@#$%^&*",
            },

            customAlphabet: "",
        },
    },

    {
        id: 1,

        key: "gmail",

        tag: "main",

        params: {
            iterations: 3,
            memorySize: 65536,
            hashLength: 16,

            selectedGroups: {
                letters: true,
                digits: true,
                special: true,
            },

            charsetGroups: {
                letters:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",

                digits:
                    "0123456789",

                special:
                    "!@#$%^&*",
            },

            customAlphabet: "",
        },
    },

    {
        id: 2,

        key: "discord",

        tag: "personal",

        params: {
            iterations: 4,
            memorySize: 131072,
            hashLength: 24,

            selectedGroups: {
                letters: true,
                digits: true,
                special: false,
            },

            charsetGroups: {
                letters:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",

                digits:
                    "0123456789",

                special:
                    "!@#$%^&*",
            },

            customAlphabet: "",
        },
    },
];

let encryptedData: EncryptedData;

const initialize = async () =>
{
    encryptedData = await encryptPassItems(
        mockItems,
        MOCK_MANAGER_PASSWORD,
    );
};

const initialized = initialize();

export const getPassManData = async (): Promise<EncryptedData> =>
{
    await initialized;

    return encryptedData;
};

export const savePassManData = async (
    data: EncryptedData,
) =>
{
    encryptedData = data;
};