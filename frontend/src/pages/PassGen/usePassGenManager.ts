import { useState } from "react";

import {
    addPassManItem,
} from "../../api";

import { useManagerSession } from "../../context/useManagerSession";

import type { PassItem } from "../../types/pass";


type UsePassGenManagerParams = {
    onError: (message: string) => void;
};


export const usePassGenManager = ({
    onError,
}: UsePassGenManagerParams) =>
{
    const {
        managerPassword,
        startSession,
    } = useManagerSession();


    const [managerModalOpen, setManagerModalOpen] =
        useState(false);

    const [managerInput, setManagerInput] =
        useState("");

    const [pendingPassItem, setPendingPassItem] =
        useState<PassItem | null>(null);


    const addToPassMan = async (
        item: PassItem,
    ) =>
    {
        if (managerPassword)
        {
            await addPassManItem(
                item,
                managerPassword,
            );

            return;
        }

        setPendingPassItem(item);
        setManagerInput("");
        setManagerModalOpen(true);
    };


    const confirmManagerPassword = async () =>
    {
        if (
            !pendingPassItem ||
            !managerInput
        )
        {
            return;
        }

        try
        {
            await addPassManItem(
                pendingPassItem,
                managerInput,
            );

            startSession(
                managerInput,
            );

            setPendingPassItem(null);
            setManagerInput("");
            setManagerModalOpen(false);
        }
        catch
        {
            onError(
                "Failed to add to PassMan",
            );
        }
    };


    const closeManagerModal = () =>
    {
        setManagerModalOpen(false);
        setPendingPassItem(null);
        setManagerInput("");
    };


    return {
        managerModalOpen,
        managerInput,

        setManagerInput,

        addToPassMan,
        confirmManagerPassword,
        closeManagerModal,
    };
};