import type { GenerateSettings } from "../components/Generate";

export type PassItem = {
    id: number;
    key: string;
    tag: string;
    params: GenerateSettings;
};

export type AuthAction = "view" | "copy";

export type EncryptedPassItem = {
    id: number;
    iv: string;
    salt: string;
    data: string;
};

export type EncryptedData = EncryptedPassItem[];
