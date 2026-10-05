import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ManagerSessionContext } from "./managerSessionContext.ts";

const SESSION_TIME = 5 * 60 * 1000;

export const ManagerSessionProvider = ({ children }: { children: ReactNode }) => {
    const [managerPassword, setManagerPassword] = useState<string | null>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearSession = useCallback(() => {
        setManagerPassword(null);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startSession = useCallback((password: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setManagerPassword(password);

        timerRef.current = setTimeout(() => {
            setManagerPassword(null);
            timerRef.current = null;
        }, SESSION_TIME);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

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
