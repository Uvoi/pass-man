import type { EncryptedPassItem, PassItem } from "../types/pass";


const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBase64 = (bytes: Uint8Array) =>
{
    let binary = "";

    for (const byte of bytes)
    {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
};

const base64ToBytes = (value: string) =>
{
    const binary = atob(value);

    return Uint8Array.from(
        binary,
        char => char.charCodeAt(0),
    );
};

const deriveKey = async (
    password: string,
    salt: Uint8Array,
) =>
{
    const saltBuffer = new Uint8Array(salt).buffer;

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"],
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: 120_000,
            hash: "SHA-256",
        },
        passwordKey,
        {
            name: "AES-CTR",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"],
    );
};

export const encryptPassItem = async (
    item: PassItem,
    password: string,
): Promise<EncryptedPassItem> =>
{
    const salt = crypto.getRandomValues(
        new Uint8Array(16),
    );

    const iv = crypto.getRandomValues(
        new Uint8Array(16),
    );

    const key = await deriveKey(
        password,
        salt,
    );

    const payload = JSON.stringify({
        key: item.key,
        tag: item.tag,
        params: item.params,
    });

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: iv,
            length: 64,
        },
        key,
        encoder.encode(payload),
    );

    return {
        id: item.id,
        iv: bytesToBase64(iv),
        salt: bytesToBase64(salt),
        data: bytesToBase64(
            new Uint8Array(encrypted),
        ),
    };
};

export const encryptPassItems = async (
    items: PassItem[],
    password: string,
): Promise<EncryptedPassItem[]> =>
{
    return Promise.all(
        items.map(item =>
            encryptPassItem(item, password),
        ),
    );
};

export const decryptPassItem = async (
    encrypted: EncryptedPassItem,
    password: string,
): Promise<PassItem> =>
{
    const iv = base64ToBytes(encrypted.iv);
    const salt = base64ToBytes(encrypted.salt);
    const data = base64ToBytes(encrypted.data);

    const key = await deriveKey(
        password,
        salt,
    );

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: iv,
            length: 64,
        },
        key,
        data,
    );

    const text = decoder.decode(decrypted);

    try
    {
        const parsed = JSON.parse(text);

        return {
            id: encrypted.id,
            key: parsed.key,
            tag: parsed.tag,
            params: parsed.params,
        };
    }
    catch
    {
        return createGarbagePassItem(
            encrypted.id,
            new Uint8Array(decrypted),
        );
    }
};

export const decryptPassItems = async (
    encryptedItems: EncryptedPassItem[],
    password: string,
): Promise<PassItem[]> =>
{
    return Promise.all(
        encryptedItems.map(item =>
            decryptPassItem(item, password),
        ),
    );
};

const createGarbagePassItem = (
    id: number,
    bytes: Uint8Array,
): PassItem =>
{
    const text = Array.from(bytes)
        .map(byte =>
            String.fromCharCode(
                33 + (byte % 94),
            ),
        )
        .join("");

    const getPart = (
        start: number,
        length: number,
    ) =>
    {
        if (text.length === 0)
        {
            return "garbage";
        }

        let result = "";

        for (let i = 0; i < length; i++)
        {
            result += text[
                (start + i) % text.length
            ];
        }

        return result;
    };

    const byte = (offset: number) =>
    {
        if (bytes.length === 0)
        {
            return 0;
        }

        return bytes[
            offset % bytes.length
        ];
    };

    return {
        id,

        key: getPart(0, 12),

        tag: getPart(12, 12),

        params: {
            iterations: 1 + (byte(0) % 8),

            memorySize: 8 + (byte(1) % 32),

            hashLength: 8 + (byte(2) % 32),

            selectedGroups: {
                letters: Boolean(byte(3) & 1),
                digits: Boolean(byte(4) & 1),
                special: Boolean(byte(5) & 1),
            },

            charsetGroups: {
                letters:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",

                digits:
                    "0123456789",

                special:
                    "!@#$%^&*",
            },

            customAlphabet: getPart(24, 16),
        },
    };
};