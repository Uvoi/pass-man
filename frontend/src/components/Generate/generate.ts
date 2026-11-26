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

export type GeneratorVersion = 1 | 2;

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
    generatorVersion?: GeneratorVersion;
    selectedGroups: Record<CharsetGroupKey, boolean>;
    charsetGroups: Record<CharsetGroupKey, string>;
    customAlphabet: string;
};

export const defaultSettings: GenerateSettings = {
    generatorVersion: 2,
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

const mapToCharsetLegacy = (bytes: Uint8Array, length: number, charset: string) => {
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

const getV2ByteStream = async (seed: Uint8Array, counter: number) => {
    const domain = new TextEncoder().encode("pass-man:generator:v2");
    const input = new Uint8Array(domain.length + seed.length + 4);

    input.set(domain);
    input.set(seed, domain.length);
    new DataView(input.buffer).setUint32(domain.length + seed.length, counter);

    return new Uint8Array(await crypto.subtle.digest("SHA-256", input));
};

const mapToCharsetV2 = async (seed: Uint8Array, length: number, charset: string) => {
    const symbols = Array.from(charset);

    if (symbols.length === 0 || symbols.length > 0x1_0000_0000) {
        throw new Error("Alphabet size is not supported");
    }

    const range = 0x1_0000_0000;
    const limit = range - (range % symbols.length);
    let result = "";
    let counter = 0;

    while (Array.from(result).length < length) {
        const bytes = await getV2ByteStream(seed, counter++);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        for (let offset = 0; offset < bytes.byteLength; offset += 4) {
            const value = view.getUint32(offset);

            if (value >= limit) continue;

            result += symbols[value % symbols.length];

            if (Array.from(result).length === length) break;
        }
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

    const charset = getCharset(params);

    if (params.generatorVersion === 2) {
        const seed = await getHash(normalizedMasterKey, salt, {
            ...params,
            hashLength: 32,
        });

        return mapToCharsetV2(seed, params.hashLength, charset);
    }

    const hash = await getHash(normalizedMasterKey, salt, params);
    const finalPassword = mapToCharsetLegacy(hash, params.hashLength, charset);

    return finalPassword;
};
