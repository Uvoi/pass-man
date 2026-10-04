import { type ReactNode,useEffect, useState } from "react";

import { ManagerSessionContext } from "./managerSessionContext.ts";

const SESSION_TIME = 5 * 60 * 1000;

export const ManagerSessionProvider = ({ children }: { children: ReactNode }) => {
    const [managerPassword, setManagerPassword] = useState<string | null>(null);

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    const clearSession = () => {
        setManagerPassword(null);

        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
    };

    const startSession = (password: string) => {
        if (timer) {
            clearTimeout(timer);
        }

        setManagerPassword(password);

        const nextTimer = setTimeout(() => {
            setManagerPassword(null);
            setTimer(null);
        }, SESSION_TIME);

        setTimer(nextTimer);
    };

    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);

    return (
        <ManagerSessionContext.Provider
            value={{
                managerPassword,
                isAuthenticated: managerPassword !== null,
                startSession,
                clearSession,
            }}
        >
            {children}
        </ManagerSessionContext.Provider>
    );
};
