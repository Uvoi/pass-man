import { useState } from "react";

import { PassGenActions, PassGenForm, PassGenPassword } from "../../components/PassGen";
import { ManagerPasswordModal } from "../../components/PassMan";
import { Title } from "../../components/Title";
import { usePassGen } from "./usePassGen";
import { usePassGenManager } from "./usePassGenManager";

export const PassGen = () => {
    const [addToPassMan, setAddToPassMan] = useState(false);

    const {
        managerModalOpen,
        managerInput,

        setManagerInput,

        addToPassMan: addItemToPassMan,
        confirmManagerPassword,
        closeManagerModal,
    } = usePassGenManager({
        onError: (message) => {
            console.error(message);
        },
    });

    const {
        masterKey,
        key,
        tag,
        password,
        settings,
        loading,
        errorMsg,
        titleTrigger,

        masterKeyError,
        keyError,

        setMasterKey,
        setKey,
        setTag,
        setSettings,

        generatePassword,
        reset,
    } = usePassGen({ onGenerated: addItemToPassMan });

    const handleGenerate = async () => {
        await generatePassword(addToPassMan);
    };

    return (
        <div
            className="
                bg-bg min-h-screen w-full
                flex flex-col justify-center
                py-8 px-4
                md:px-28
                lg:px-64
                xl:px-60
            "
        >
            <Title trigger={titleTrigger} defaultText="pass-gen" />

            <div
                className="
                    flex flex-col gap-12
                    justify-center
                    py-6 px-4
                    bg-surface
                    rounded-xl
                    md:p-8
                "
            >
                <PassGenForm
                    masterKey={masterKey}
                    passKey={key}
                    tag={tag}
                    masterKeyError={masterKeyError}
                    keyError={keyError}
                    disabled={loading}
                    onMasterKeyChange={setMasterKey}
                    onKeyChange={setKey}
                    onTagChange={setTag}
                />

                <PassGenActions
                    settings={settings}
                    loading={loading}
                    errorMsg={errorMsg}
                    addToPassMan={addToPassMan}
                    onGenerate={handleGenerate}
                    onSettingsChange={setSettings}
                    onReset={reset}
                    onAddToPassManChange={setAddToPassMan}
                />

                <PassGenPassword password={password} />
            </div>

            {managerModalOpen && (
                <ManagerPasswordModal
                    value={managerInput}
                    onChange={setManagerInput}
                    onConfirm={confirmManagerPassword}
                    onClose={closeManagerModal}
                />
            )}
        </div>
    );
};
