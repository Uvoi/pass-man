import { useState } from "react";

import { getPassManData, savePassManData } from "../../api";
import type { PassItem } from "../../types/pass";
import { decryptPassItems, encryptPassItems } from "../../utils";

type UsePassManParams = {
    managerPassword: string | null;
    startSession: (password: string) => void;
};

export const usePassMan = ({ managerPassword, startSession }: UsePassManParams) => {
    const [passwords, setPasswords] = useState<PassItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [generatedPasswords, setGeneratedPasswords] = useState<Record<number, string>>({});

    const loadData = async (password: string) => {
        setLoading(true);

        try {
            const encrypted = await getPassManData();

            const decrypted = await decryptPassItems(encrypted, password);

            setPasswords(decrypted);
            setGeneratedPasswords({});

            startSession(password);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (items: PassItem[]) => {
        if (!managerPassword) {
            throw new Error("Manager password is not available");
        }

        const encrypted = await encryptPassItems(items, managerPassword);

        await savePassManData(encrypted);

        setPasswords(items);
    };

    return {
        passwords,
        loading,
        generatedPasswords,

        setPasswords,
        setGeneratedPasswords,

        loadData,
        saveData,
    };
};
