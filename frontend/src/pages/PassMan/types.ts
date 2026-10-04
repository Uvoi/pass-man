import type { AuthAction, PassItem } from "../../types";

export type ContextMenuState = {
    x: number;
    y: number;
    item: PassItem;
} | null;

export type AuthState = {
    item: PassItem | null;
    action: AuthAction | null;
    masterKey: string;
    error: boolean;
};

export type ManagerModalState = {
    open: boolean;
    input: string;
};
