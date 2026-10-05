import { useEffect, useRef, useState } from "react";

import {
    CustomAlphabetModal,
    EditPassModal,
    ManagerPasswordModal,
    MasterKeyModal,
    PassContextMenu,
    PassManHeader,
    PassManTable,
} from "../../components/PassMan";
import { useManagerSession } from "../../context/useManagerSession";
import type { PassItem } from "../../types";
import type { ContextMenuState } from "./types";
import { usePassMan } from "./usePassMan";
import { usePassManActions } from "./usePassManActions";
import { usePassManAuth } from "./usePassManAuth";

type PassManProps = {
    isActive: boolean;
};

export const PassMan = ({ isActive }: PassManProps) => {
    const { managerPassword, isAuthenticated, startSession } = useManagerSession();

    const { passwords, loading, generatedPasswords, setGeneratedPasswords, loadData, saveData } =
        usePassMan({
            managerPassword,
            startSession,
        });

    const { handleDelete, handleEdit } = usePassManActions({
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

    const [managerModalOpen, setManagerModalOpen] = useState(false);

    const [managerInput, setManagerInput] = useState("");

    const [customAlphabetItem, setCustomAlphabetItem] = useState<PassItem | null>(null);

    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

    const [editItem, setEditItem] = useState<PassItem | null>(null);

    const wasActive = useRef(false);

    useEffect(() => {
        if (!isActive) {
            wasActive.current = false;
            return;
        }

        if (wasActive.current) {
            return;
        }

        wasActive.current = true;

        if (managerPassword) {
            void loadData(managerPassword, false).catch((error: unknown) => {
                console.error("Failed to refresh PassMan data", error);
            });
        }
    }, [isActive, loadData, managerPassword]);

    useEffect(() => {
        if (!isAuthenticated) {
            setGeneratedPasswords({});
        }
    }, [isAuthenticated, setGeneratedPasswords]);

    const handleManagerPasswordConfirm = async () => {
        await loadData(managerInput);

        setManagerModalOpen(false);
        setManagerInput("");
    };

    const handleManagerPasswordClose = () => {
        if (isAuthenticated) {
            setManagerModalOpen(false);
        }
    };

    const handleDeleteItem = async (item: PassItem) => {
        await handleDelete(item);

        setContextMenu(null);
    };

    const handleEditItem = (item: PassItem) => {
        setEditItem(item);
        setContextMenu(null);
    };

    return (
        <div
            className="
                bg-bg min-h-screen w-full flex flex-col
                py-8 px-4 md:px-5 lg:px-30 xl:px-26
            "
            onClick={() => {
                setContextMenu(null);
            }}
        >
            <PassManHeader
                isAuthenticated={isAuthenticated}
                onChangeManagerPassword={() => {
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
                onContextMenu={(x, y, item) => {
                    setContextMenu({
                        x,
                        y,
                        item,
                    });
                }}
            />

            {(managerModalOpen || !isAuthenticated) && (
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
                    value={customAlphabetItem.params.customAlphabet}
                    onClose={() => setCustomAlphabetItem(null)}
                />
            )}

            {editItem && (
                <EditPassModal
                    item={editItem}
                    onSave={(key, tag, params) => {
                        handleEdit(editItem, key, tag, params);

                        setEditItem(null);
                    }}
                    onClose={() => setEditItem(null)}
                />
            )}

            {contextMenu && (
                <PassContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onEdit={() => handleEditItem(contextMenu.item)}
                    onDelete={() => handleDeleteItem(contextMenu.item)}
                />
            )}
        </div>
    );
};
