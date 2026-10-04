import type { Dispatch, SetStateAction } from "react";

import type { GenerateSettings } from "../../components/Generate/generate";
import type { PassItem } from "../../types/pass";


type UsePassManActionsParams = {
    passwords: PassItem[];
    setGeneratedPasswords: Dispatch<
        SetStateAction<Record<number, string>>
    >;
    saveData: (items: PassItem[]) => Promise<void>;
};


export const usePassManActions = ({
    passwords,
    setGeneratedPasswords,
    saveData,
}: UsePassManActionsParams) =>
{
    const handleDelete = async (item: PassItem) =>
    {
        const next = passwords.filter(
            password => password.id !== item.id,
        );

        setGeneratedPasswords(prev =>
        {
            const nextPasswords = { ...prev };

            delete nextPasswords[item.id];

            return nextPasswords;
        });

        await saveData(next);
    };


    const handleEdit = async (
        item: PassItem,
        key: string,
        tag: string,
        params: GenerateSettings,
    ) =>
    {
        const next = passwords.map(password =>
            password.id === item.id
                ? {
                    ...password,
                    key,
                    tag,
                    params,
                }
                : password,
        );

        setGeneratedPasswords(prev =>
        {
            const nextPasswords = { ...prev };

            delete nextPasswords[item.id];

            return nextPasswords;
        });

        await saveData(next);
    };


    return {
        handleDelete,
        handleEdit,
    };
};