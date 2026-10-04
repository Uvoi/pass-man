import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../Button";

type ModalProps = {
    trigger: React.ReactNode;
    children: ((close: () => void) => React.ReactNode) | React.ReactNode;
    onOpen?: () => void;
    disabled?: boolean;
};

export const Modal = ({ trigger, children, onOpen, disabled }: ModalProps) => {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleOpen = () => {
        onOpen?.();
        setOpen(true);
        requestAnimationFrame(() => setVisible(true));
    };

    const close = () => {
        setVisible(false);
        setTimeout(() => setOpen(false), 200);
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && close();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open]);

    return (
        <>
            <div onClick={disabled ? undefined : handleOpen}>{trigger}</div>

            {open && (
                <div
                    className={`fixed inset-0 bg-overlay flex items-center justify-center z-50 transition-opacity duration-200 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={close}
                >
                    <div
                        className={`max-h-[90vh] overflow-y-auto bg-surface rounded-xl px-4 py-4 md:px-6 min-w-80 max-w-lg w-full mx-4 transition-all duration-200 ${
                            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end mb-12">
                            <Button onClick={close} className="p-2! text-sm bg-inherit">
                                <X width={30} height={30} />
                            </Button>
                        </div>
                        {typeof children === "function" ? children(close) : children}
                    </div>
                </div>
            )}
        </>
    );
};
