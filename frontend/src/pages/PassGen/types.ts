import type { GenerateSettings } from "../../components/Generate";
import type { PassItem } from "../../types";

export type PassGenState = {
    masterKey: string;
    key: string;
    tag: string;
    password: string;
    settings: GenerateSettings;
    loading: boolean;
    errorMsg: string;
    titleTrigger: number;
};

export type PassGenManagerState = {
    managerModalOpen: boolean;
    managerInput: string;
    pendingPassItem: PassItem | null;
};
