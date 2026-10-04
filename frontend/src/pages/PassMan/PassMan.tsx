import { useEffect, useState } from "react";

import { CustomAlphabetModal } from "../../components/PassMan/CustomAlphabetModal";
import { EditPassModal } from "../../components/PassMan/EditPassModal";
import { MasterKeyModal } from "../../components/PassMan/MasterKeyModal";
import { ManagerPasswordModal } from "../../components/PassMan/ManagerPasswordModal";
import { PassContextMenu } from "../../components/PassMan/PassContextMenu";
import { PassManHeader } from "../../components/PassMan/PassManHeader";
import { PassManTable } from "../../components/PassMan/PassManTable";

import type { PassItem } from "../../types/pass";

import {
    usePassMan,
} from "./usePassMan";

import {
    usePassManActions,
} from "./usePassManActions";

import {
    usePassManAuth,
} from "./usePassManAuth";

import type {
    ContextMenuState,
} from "./types";

import { useManagerSession } from "../../context/ManagerSessionContext";


export const PassMan = () =>
{
    const {
        managerPassword,
        isAuthenticated,
        startSession,
    } = useManagerSession();


    const {
        passwords,
        loading,
        generatedPasswords,
        setGeneratedPasswords,
        loadData,
        saveData,
    } = usePassMan({
        managerPassword,
        startSession,
    });


    const {
        handleDelete,
        handleEdit,
    } = usePassManActions({
        passwords,
        setGeneratedPasswords,
        saveData,
    });


    const {
        authItem,
        masterKey,
        authError,
        setMasterKey,
        handleAuth,
        handleView,
        handleCopy,
        closeAuthModal,
    } = usePassManAuth({
        generatedPasswords,
        setGeneratedPasswords,
    });


    const [managerModalOpen, setManagerModalOpen] =
        useState(false);

    const [managerInput, setManagerInput] =
        useState("");


    const [customAlphabetItem, setCustomAlphabetItem] =
        useState<PassItem | null>(null);


    const [contextMenu, setContextMenu] =
        useState<ContextMenuState>(null);


    const [editItem, setEditItem] =
        useState<PassItem | null>(null);


    useEffect(() =>
    {
        setManagerModalOpen(true);
    }, []);


    useEffect(() =>
    {
        if (!isAuthenticated)
        {
            setGeneratedPasswords({});
            setManagerModalOpen(true);
        }
    }, [
        isAuthenticated,
        setGeneratedPasswords,
    ]);


    const handleManagerPasswordConfirm = async () =>
    {
        await loadData(managerInput);

        setManagerModalOpen(false);
        setManagerInput("");
    };


    const handleManagerPasswordClose = () =>
    {
        if (isAuthenticated)
        {
            setManagerModalOpen(false);
        }
    };


    const handleDeleteItem = async (item: PassItem) =>
    {
        await handleDelete(item);

        setContextMenu(null);
    };


    const handleEditItem = (
        item: PassItem,
    ) =>
    {
        setEditItem(item);
        setContextMenu(null);
    };


    return (
        <div
            className="
                bg-bg min-h-screen w-full flex flex-col
                py-8 px-4 md:px-5 lg:px-30 xl:px-26
            "
            onClick={() =>
            {
                setContextMenu(null);
            }}
        >
            <PassManHeader
                isAuthenticated={isAuthenticated}
                onChangeManagerPassword={() =>
                {
                    setManagerModalOpen(true);
                    setManagerInput("");
                }}
            />


            <PassManTable
                loading={loading}
                passwords={passwords}
                generatedPasswords={generatedPasswords}
                onView={handleView}
                onCopy={handleCopy}
                onCustomAlphabet={setCustomAlphabetItem}
                onContextMenu={(x, y, item) =>
                {
                    setContextMenu({
                        x,
                        y,
                        item,
                    });
                }}
            />


            {managerModalOpen && (
                <ManagerPasswordModal
                    value={managerInput}
                    onChange={setManagerInput}
                    onConfirm={handleManagerPasswordConfirm}
                    onClose={handleManagerPasswordClose}
                />
            )}


            {authItem && (
                <MasterKeyModal
                    item={authItem}
                    value={masterKey}
                    error={authError}
                    onChange={setMasterKey}
                    onConfirm={handleAuth}
                    onClose={closeAuthModal}
                />
            )}


            {customAlphabetItem?.params.customAlphabet && (
                <CustomAlphabetModal
                    value={
                        customAlphabetItem.params.customAlphabet
                    }
                    onClose={() =>
                        setCustomAlphabetItem(null)
                    }
                />
            )}


            {editItem && (
                <EditPassModal
                    item={editItem}
                    onSave={(
                        key,
                        tag,
                        params,
                    ) =>
                    {
                        handleEdit(
                            editItem,
                            key,
                            tag,
                            params,
                        );

                        setEditItem(null);
                    }}
                    onClose={() =>
                        setEditItem(null)
                    }
                />
            )}


            {contextMenu && (
                <PassContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onEdit={() =>
                        handleEditItem(
                            contextMenu.item,
                        )
                    }
                    onDelete={() =>
                        handleDeleteItem(
                            contextMenu.item,
                        )
                    }
                />
            )}
        </div>
    );
};