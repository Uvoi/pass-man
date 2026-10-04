import type { GenerateSettings } from "../../components/Generate/generate";
import type { PassItem } from "../../types/pass";


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
