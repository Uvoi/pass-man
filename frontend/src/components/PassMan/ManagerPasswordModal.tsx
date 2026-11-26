import { Button } from "../Button";
import { Input } from "../Input";

type ManagerPasswordModalProps = {
    value: string;
    title?: string;
    error?: string;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
};

export const ManagerPasswordModal = ({
    value,
    title = "Manager password",
    error,
    onChange,
    onConfirm,
    onClose,
}: ManagerPasswordModalProps) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            onClose();
            return;
        }

        if (
            event.key === "Enter" &&
            !event.nativeEvent.isComposing &&
            !(event.target instanceof HTMLButtonElement)
        ) {
            event.preventDefault();
            onConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="bg-surface rounded-xl px-4 py-6 md:px-6 w-full max-w-lg mx-4"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="flex flex-col gap-5">
                    <div className="text-text text-2xl">{title}</div>

                    <Input
                        value={value}
                        onChange={onChange}
                        type="password"
                        rightAddon="visible"
                        placeholder="Manager password"
                        autoFocus
                    />

                    {error && <div className="text-error">{error}</div>}

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
