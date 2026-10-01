import { useEffect, useState } from "react";



import {
    getPassManData,
    mockMasterKeys,
    savePassManData,
} from "../../mock/passManApi";

import { decryptPassItems, encryptPassItems } from "../../utils/crypto";

import { PassRow } from "../../components/PassMan/PassRow";
import { MasterKeyModal } from "../../components/PassMan/MasterKeyModal";
import { CustomAlphabetModal } from "../../components/PassMan/CustomAlphabetModal";
import { ManagerPasswordModal } from "../../components/PassMan/ManagerPasswordModal";
import { EditPassModal } from "../../components/PassMan/EditPassModal";
import { PassContextMenu } from "../../components/PassMan/PassContextMenu";

import { useManagerSession } from "./useManagerSession";
import type { AuthAction, PassItem } from "../../types/pass";

type ContextMenuState = {
    x: number;
    y: number;
    item: PassItem;
} | null;

export const PassMan = () =>
{
    const [passwords, setPasswords] = useState<PassItem[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        managerPassword,
        isAuthenticated,
        startSession,
    } = useManagerSession();

    const [managerModalOpen, setManagerModalOpen] = useState(false);
    const [managerInput, setManagerInput] = useState("");
    

    const [generatedPasswords, setGeneratedPasswords] =
        useState<Record<number, string>>({});

    const [authItem, setAuthItem] =
        useState<PassItem | null>(null);

    const [authAction, setAuthAction] =
        useState<AuthAction | null>(null);

    const [masterKey, setMasterKey] = useState("");
    const [authError, setAuthError] = useState(false);

    const [customAlphabetItem, setCustomAlphabetItem] =
        useState<PassItem | null>(null);

    const [contextMenu, setContextMenu] =
        useState<ContextMenuState>(null);

    const [editItem, setEditItem] =
        useState<PassItem | null>(null);

    const loadData = async (password: string) =>
    {
        setLoading(true);

        try
        {
            const encrypted = await getPassManData();

            const decrypted = await decryptPassItems(
                encrypted,
                password,
            );

            setPasswords(decrypted);
            setGeneratedPasswords({});

            startSession(password);

            setManagerModalOpen(false);
            setManagerInput("");
        }
        finally
        {
            setLoading(false);
        }
    };

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
    }, [isAuthenticated]);

    const generatePassword = async (
        item: PassItem,
        masterKey: string,
    ) =>
    {
        const { getPassword } =
            await import("../../components/Generate/generate");

        return getPassword(
            masterKey,
            item.key,
            item.tag,
            item.params,
        );
    };

    const openAuthModal = (
        item: PassItem,
        action: AuthAction,
    ) =>
    {
        setAuthItem(item);
        setAuthAction(action);
        setMasterKey("");
        setAuthError(false);
    };

    const closeAuthModal = () =>
    {
        setAuthItem(null);
        setAuthAction(null);
        setMasterKey("");
        setAuthError(false);
    };

    const handleAuth = async () =>
    {
        if (!authItem || !authAction)
        {
            return;
        }

        const expectedMasterKey =
            mockMasterKeys[authItem.id];

        if (
            expectedMasterKey === undefined ||
            masterKey !== expectedMasterKey
        )
        {
            setAuthError(true);
            return;
        }

        try
        {
            const password = await generatePassword(
                authItem,
                masterKey,
            );

            if (authAction === "view")
            {
                setGeneratedPasswords(prev => ({
                    ...prev,
                    [authItem.id]: password,
                }));
            }

            if (authAction === "copy")
            {
                await navigator.clipboard.writeText(password);
            }

            closeAuthModal();
        }
        catch
        {
            setAuthError(true);
        }
    };

    const handleView = (item: PassItem) =>
    {
        if (generatedPasswords[item.id])
        {
            setGeneratedPasswords(prev =>
            {
                const next = { ...prev };

                delete next[item.id];

                return next;
            });

            return;
        }

        openAuthModal(item, "view");
    };

    const handleCopy = async (item: PassItem) =>
    {
        const password = generatedPasswords[item.id];

        if (password)
        {
            await navigator.clipboard.writeText(password);

            return;
        }

        openAuthModal(item, "copy");
    };

    const saveData = async (items: PassItem[]) =>
    {
        if (!managerPassword)
        {
            setManagerModalOpen(true);

            return;
        }

        const encrypted = await encryptPassItems(
            items,
            managerPassword,
        );

        await savePassManData(encrypted);

        setPasswords(items);
    };

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
        params: PassItem["params"],
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

        setEditItem(null);
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
            <div className="mb-6 flex items-center justify-between">
                <div className="text-text text-2xl">
                    Passwords
                </div>

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={(event) =>
                        {
                            event.stopPropagation();

                            setManagerModalOpen(true);
                            setManagerInput("");
                        }}
                        className="text-text hover:text-accent"
                    >
                        Change manager password
                    </button>
                )}
            </div>

            {loading && (
                <div className="text-text/50">
                    Loading...
                </div>
            )}

            {!loading && (
                <div
                    className="
                        w-full overflow-hidden
                        rounded-xl border-2 border-border
                    "
                >
                    <div
                        className="
                            hidden md:grid
                            grid-cols-[1fr_1fr_2fr_2fr]
                            gap-4
                            px-6 py-4
                            bg-surface
                            text-text
                            font-semibold
                        "
                    >
                        <div>
                            Key
                        </div>

                        <div>
                            Tag
                        </div>

                        <div>
                            Password
                        </div>

                        <div>
                            Parameters
                        </div>
                    </div>

                    <div className="divide-y-2 divide-border">
                        {passwords.map(item => (
                            <PassRow
                                key={item.id}
                                item={item}
                                password={generatedPasswords[item.id]}
                                onView={() => handleView(item)}
                                onCopy={() => handleCopy(item)}
                                onCustomAlphabet={() =>
                                    setCustomAlphabetItem(item)
                                }
                                onContextMenu={(x, y) =>
                                    setContextMenu({
                                        x,
                                        y,
                                        item,
                                    })
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            {managerModalOpen && (
                <ManagerPasswordModal
                    value={managerInput}
                    onChange={value =>
                    {
                        setManagerInput(value);
                    }}
                    onConfirm={() =>
                        loadData(managerInput)
                    }
                    onClose={() =>
                    {
                        if (isAuthenticated)
                        {
                            setManagerModalOpen(false);
                        }
                    }}
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
                    onClose={() =>
                        setCustomAlphabetItem(null)
                    }
                />
            )}

            {editItem && (
                <EditPassModal
                    item={editItem}
                    onSave={(key, tag, params) =>
                        handleEdit(
                            editItem,
                            key,
                            tag,
                            params,
                        )
                    }
                    onClose={() => setEditItem(null)}
                />
            )}

            {contextMenu && (
                <PassContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onEdit={() =>
                    {
                        setEditItem(contextMenu.item);
                        setContextMenu(null);
                    }}
                    onDelete={() =>
                    {
                        handleDelete(contextMenu.item);
                        setContextMenu(null);
                    }}
                />
            )}
        </div>
    );
};