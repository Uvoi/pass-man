
import type { PassItem } from "../../types/pass";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";


type MasterKeyModalProps = {
    item: PassItem;
    value: string;
    error: boolean;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
};

export const MasterKeyModal = ({
    item,
    value,
    error,
    onChange,
    onConfirm,
    onClose,
}: MasterKeyModalProps) =>
{
    return (
        <div
            className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-xl px-4 py-6 md:px-6 w-full max-w-lg mx-4"
                onClick={event => event.stopPropagation()}
            >
                <div className="flex flex-col gap-5">
                    <div className="text-text text-2xl">
                        Master key
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-text/50 text-sm mb-1">
                                Key
                            </div>

                            <div className="text-text text-lg">
                                {item.key}
                            </div>
                        </div>

                        <div>
                            <div className="text-text/50 text-sm mb-1">
                                Tag
                            </div>

                            <div className="text-text text-lg">
                                {item.tag}
                            </div>
                        </div>
                    </div>

                    <div className="text-text/70">
                        Enter master key to continue
                    </div>

                    <Input
                        value={value}
                        onChange={onChange}
                        type="password"
                        rightAddon="visible"
                        error={error}
                        placeholder="Master key"
                    />

                    {error && (
                        <span className="text-error">
                            Invalid master key
                        </span>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={onClose}
                            className="bg-transparent!"
                        >
                            Cancel
                        </Button>

                        <Button onClick={onConfirm}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};