import { argon2id } from "hash-wasm";

const getNormalized = (value: string) => value.trim();

const getSalt = (normalizedKey: string, tag: string) => {
    const salt = `${normalizedKey}:${tag || "default"}:v1`;
    const byteLength = new TextEncoder().encode(salt).byteLength;

    return byteLength < 8 ? salt.padEnd(salt.length + 8 - byteLength, "0") : salt;
};

export type ArgonParams = {
    iterations: number;
    memorySize: number;
    hashLength: number;
};

export const defaultCharsetGroups = {
    letters: {
        label: "A-z",
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    },
    digits: {
        label: "0-9",
        chars: "0123456789",
    },
    special: {
        label: "Special characters",
        chars: "!@#$%^&*",
    },
} as const;

export type CharsetGroupKey = keyof typeof defaultCharsetGroups;

export type GenerateSettings = ArgonParams & {
    selectedGroups: Record<CharsetGroupKey, boolean>;
    charsetGroups: Record<CharsetGroupKey, string>;
    customAlphabet: string;
};

export const defaultSettings: GenerateSettings = {
    iterations: 3,
    memorySize: 65536,
    hashLength: 16,
    selectedGroups: {
        letters: true,
        digits: true,
        special: true,
    },
    charsetGroups: {
        letters: defaultCharsetGroups.letters.chars,
        digits: defaultCharsetGroups.digits.chars,
        special: defaultCharsetGroups.special.chars,
    },
    customAlphabet: "",
};

const getHash = async (masterKey: string, salt: string, params: ArgonParams) =>
    await argon2id({
        password: masterKey,
        salt: salt,
        parallelism: 1,
        iterations: params.iterations,
        memorySize: params.memorySize,
        hashLength: params.hashLength,
        outputType: "binary",
    });

export const normalizeCharset = (value: string) => Array.from(new Set(Array.from(value))).join("");

export const getCharset = (settings: GenerateSettings) => {
    const selected = Object.entries(settings.selectedGroups).flatMap(([key, enabled]) =>
        enabled ? Array.from(settings.charsetGroups[key as CharsetGroupKey]) : [],
    );

    return normalizeCharset([...selected, ...Array.from(settings.customAlphabet)].join(""));
};

const mapToCharset = (bytes: Uint8Array, length: number, charset: string) => {
    const limit = 256 - (256 % charset.length);
    let result = "";
    let i = 0;

    for (const byte of bytes) {
        if (byte >= limit) continue;
        result += charset[byte % charset.length];
        if (++i === length) break;
    }

    return result;
};

export const getPassword = async (
    masterKey: string,
    key: string,
    tag: string,
    params: GenerateSettings,
) => {
    const normalizedMasterKey = getNormalized(masterKey);
    const normalizedKey = getNormalized(key);
    const normalizedTag = getNormalized(tag);

    const salt = getSalt(normalizedKey, normalizedTag);

    const hash = await getHash(normalizedMasterKey, salt, params);

    const charset = getCharset(params);
    const finalPassword = mapToCharset(hash, params.hashLength, charset);

    return finalPassword;
};
