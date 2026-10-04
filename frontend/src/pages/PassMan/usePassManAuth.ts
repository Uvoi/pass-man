import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { AuthAction, PassItem } from "../../types";

type UsePassManAuthParams = {
    generatedPasswords: Record<number, string>;

    setGeneratedPasswords: Dispatch<SetStateAction<Record<number, string>>>;
};

export const usePassManAuth = ({
    generatedPasswords,
    setGeneratedPasswords,
}: UsePassManAuthParams) => {
    const [authItem, setAuthItem] = useState<PassItem | null>(null);

    const [authAction, setAuthAction] = useState<AuthAction | null>(null);

    const [masterKey, setMasterKey] = useState("");

    const [authError, setAuthError] = useState(false);

    const generatePassword = async (item: PassItem, key: string) => {
        const { getPassword } = await import("../../components/Generate/generate");

        return getPassword(key, item.key, item.tag, item.params);
    };

    const openAuthModal = (item: PassItem, action: AuthAction) => {
        setAuthItem(item);
        setAuthAction(action);
        setMasterKey("");
        setAuthError(false);
    };

    const closeAuthModal = () => {
        setAuthItem(null);
        setAuthAction(null);
        setMasterKey("");
        setAuthError(false);
    };

    const handleAuth = async () => {
        if (!authItem || !authAction) {
            return;
        }

        if (!masterKey) {
            setAuthError(true);

            return;
        }

        try {
            const password = await generatePassword(authItem, masterKey);

            if (authAction === "view") {
                setGeneratedPasswords((prev) => ({
                    ...prev,
                    [authItem.id]: password,
                }));
            }

            if (authAction === "copy") {
                await navigator.clipboard.writeText(password);
            }

            closeAuthModal();
        } catch {
            setAuthError(true);
        }
    };

    const handleView = (item: PassItem) => {
        if (generatedPasswords[item.id]) {
            setGeneratedPasswords((prev) => {
                const next = { ...prev };

                delete next[item.id];

                return next;
            });

            return;
        }

        openAuthModal(item, "view");
    };

    const handleCopy = async (item: PassItem) => {
        const password = generatedPasswords[item.id];

        if (password) {
            await navigator.clipboard.writeText(password);

            return;
        }

        openAuthModal(item, "copy");
    };

    return {
        authItem,
        authAction,
        masterKey,
        authError,

        setMasterKey,

        openAuthModal,
        closeAuthModal,
        handleAuth,
        handleView,
        handleCopy,
    };
};
