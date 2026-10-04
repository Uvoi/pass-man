import { useState } from "react";

import type { PassItem } from "../../types";
import { Button } from "../Button";
import { Input } from "../Input";
import { SettingsModal } from "../Modal";

type EditPassModalProps = {
    item: PassItem;
    onSave: (key: string, tag: string, params: PassItem["params"]) => void;
    onClose: () => void;
};

export const EditPassModal = ({ item, onSave, onClose }: EditPassModalProps) => {
    const [key, setKey] = useState(item.key);
    const [tag, setTag] = useState(item.tag);
    const [params, setParams] = useState(item.params);

    const keyError = key.length > 0 && (key.includes(" ") || key.length < 2);

    const handleSave = () => {
        if (!key || keyError) {
            return;
        }

        onSave(key, tag, params);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-xl px-4 py-6 md:px-6 w-full max-w-lg mx-4"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-col gap-6">
                    <div className="text-text text-2xl">Edit password</div>

                    <Input
                        value={key}
                        onChange={setKey}
                        placeholder="Key"
                        error={keyError}
                        rightAddon="clear"
                    />

                    <Input value={tag} onChange={setTag} placeholder="Tag" rightAddon="clear" />

                    <SettingsModal settings={params} onChange={setParams} />

                    <div className="flex justify-end gap-3">
                        <Button onClick={onClose} className="bg-transparent!">
                            Cancel
                        </Button>

                        <Button onClick={handleSave} disabled={!key || keyError}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
