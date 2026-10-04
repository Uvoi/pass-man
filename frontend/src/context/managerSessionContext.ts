import { createContext } from "react";

type ManagerSessionContextValue = {
    managerPassword: string | null;
    isAuthenticated: boolean;
    startSession: (password: string) => void;
    clearSession: () => void;
};

export const ManagerSessionContext = createContext<ManagerSessionContextValue | null>(null);
