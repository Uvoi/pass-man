import { Button } from "../Button";
import { Input } from "../Input";

type ManagerPasswordModalProps = {
    value: string;
    title?: string;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
};

export const ManagerPasswordModal = ({
    value,
    title = "Manager password",
    onChange,
    onConfirm,
    onClose,
}: ManagerPasswordModalProps) => {
    return (
        <div
            className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-xl px-4 py-6 md:px-6 w-full max-w-lg mx-4"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-col gap-5">
                    <div className="text-text text-2xl">{title}</div>

                    <Input
                        value={value}
                        onChange={onChange}
                        type="password"
                        rightAddon="visible"
                        placeholder="Manager password"
                    />

                    <div className="flex justify-end gap-3">
                        <Button onClick={onClose} className="bg-transparent!">
                            Cancel
                        </Button>

                        <Button onClick={onConfirm}>Confirm</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
