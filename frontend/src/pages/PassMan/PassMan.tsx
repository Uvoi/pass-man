import { useEffect, useRef, useState } from "react";

import { exportNativeBackup, importNativeBackup, isNativeApp } from "../../api/nativeBackup";
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

    const [managerModalOpen, setManagerModalOpen] = useState(!isAuthenticated);

    const [managerInput, setManagerInput] = useState("");

    const [customAlphabetItem, setCustomAlphabetItem] = useState<PassItem | null>(null);

    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

    const [editItem, setEditItem] = useState<PassItem | null>(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
    const [backupBusy, setBackupBusy] = useState(false);

    const [managerError, setManagerError] = useState("");

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
                setErrorMessage("Failed to refresh PassMan data");
            });
        }
    }, [isActive, loadData, managerPassword]);

    useEffect(() => {
        if (!isAuthenticated) {
            setGeneratedPasswords({});
        }
    }, [isAuthenticated, setGeneratedPasswords]);

    const handleManagerPasswordConfirm = async () => {
        try {
            await loadData(managerInput);
            setManagerModalOpen(false);
            setManagerInput("");
            setManagerError("");
        } catch {
            setManagerError("Failed to load PassMan data");
        }
    };

    const handleManagerPasswordClose = () => {
        setManagerModalOpen(false);
        setManagerError("");
    };

    const handleDeleteItem = async (item: PassItem) => {
        try {
            await handleDelete(item);
            setContextMenu(null);
            setErrorMessage("");
        } catch {
            setErrorMessage("Failed to delete the password record");
        }
    };

    const handleEditItem = (item: PassItem) => {
        setEditItem(item);
        setContextMenu(null);
    };

    const handleExport = async () => {
        setBackupBusy(true);
        try {
            const exported = await exportNativeBackup();
            setNoticeMessage(exported ? "Backup exported" : "");
            setErrorMessage("");
        } catch (error) {
            console.error("Failed to export PassMan backup", error);
            setErrorMessage("Failed to export backup");
        } finally {
            setBackupBusy(false);
        }
    };

    const handleImport = async () => {
        if (
            !window.confirm(
                "Importing a backup will replace all current PassMan records. Continue?",
            )
        ) {
            return;
        }

        setBackupBusy(true);
        try {
            const imported = await importNativeBackup();
            if (imported === null) return;

            setGeneratedPasswords({});
            if (managerPassword) await loadData(managerPassword, false);
            setNoticeMessage(`Imported ${imported} records`);
            setErrorMessage("");
        } catch (error) {
            console.error("Failed to import PassMan backup", error);
            setErrorMessage(
                "Failed to import backup. Check that the file is a valid PassMan backup.",
            );
        } finally {
            setBackupBusy(false);
        }
    };

    return (
        <div
            className="
                bg-bg min-h-screen w-full flex flex-col
                py-4 px-0 sm:py-8 sm:px-4 md:px-5 lg:px-30 xl:px-26
            "
            onClick={() => {
                setContextMenu(null);
            }}
        >
            <PassManHeader
                isAuthenticated={isAuthenticated}
                busy={backupBusy}
                onExport={isNativeApp ? handleExport : undefined}
                onImport={isNativeApp ? handleImport : undefined}
                onChangeManagerPassword={() => {
                    setManagerModalOpen(true);
                    setManagerInput("");
                    setManagerError("");
                }}
            />

            {errorMessage && (
                <div role="alert" className="mb-4 rounded-lg border border-error p-3 text-error">
                    {errorMessage}
                </div>
            )}

            {noticeMessage && (
                <div role="status" className="mb-4 rounded-lg border border-accent p-3 text-accent">
                    {noticeMessage}
                </div>
            )}

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

            {managerModalOpen && (
                <ManagerPasswordModal
                    value={managerInput}
                    error={managerError}
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
                    onSave={async (key, tag, params) => {
                        await handleEdit(editItem, key, tag, params);
                        setEditItem(null);
                        setErrorMessage("");
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
