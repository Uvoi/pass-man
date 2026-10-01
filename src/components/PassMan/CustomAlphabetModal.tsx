import { Button } from "../Button/Button";

type CustomAlphabetModalProps = {
    value: string;
    onClose: () => void;
};

export const CustomAlphabetModal = ({
    value,
    onClose,
}: CustomAlphabetModalProps) =>
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
                        Custom alphabet
                    </div>

                    <div className="p-4 rounded-lg bg-bg border-2 border-border overflow-x-auto hide-scrollbar">
                        <span className="font-mono text-lg text-text whitespace-nowrap">
                            {value}
                        </span>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};