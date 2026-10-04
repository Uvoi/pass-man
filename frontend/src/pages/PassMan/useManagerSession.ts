import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_TIME = 5 * 60 * 1000;

export const useManagerSession = () => {
    const [managerPassword, setManagerPassword] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSession = useCallback((password: string) => {
        setManagerPassword(password);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setManagerPassword(null);
        }, SESSION_TIME);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        managerPassword,
        isAuthenticated: managerPassword !== null,
        startSession,
    };
};
