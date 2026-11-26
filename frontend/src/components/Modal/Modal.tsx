import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";

type ModalProps = {
    trigger: React.ReactNode;
    children: ((close: () => void) => React.ReactNode) | React.ReactNode;
    onOpen?: () => void;
    disabled?: boolean;
    className?: string;
    onConfirm?: (close: () => void) => void;
    confirmDisabled?: boolean;
};

export const Modal = ({
    trigger,
    children,
    onOpen,
    disabled,
    className,
    onConfirm,
    confirmDisabled,
}: ModalProps) => {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const handleOpen = () => {
        previousFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        onOpen?.();
        setOpen(true);
        requestAnimationFrame(() => setVisible(true));
    };

    const close = () => {
        setVisible(false);
        setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    useEffect(() => {
        if (!open) {
            previousFocusRef.current?.focus({ preventScroll: true });
            return;
        }

        const frame = requestAnimationFrame(() => {
            dialogRef.current?.focus({ preventScroll: true });
        });

        return () => cancelAnimationFrame(frame);
    }, [open]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
        }

        if (event.key !== "Enter") return;

        event.stopPropagation();

        const target = event.target;
        const keepsEnter =
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target instanceof HTMLButtonElement;

        if (keepsEnter || event.nativeEvent.isComposing || !onConfirm || confirmDisabled) return;

        event.preventDefault();
        onConfirm(close);
    };

    return (
        <>
            <div onClick={disabled ? undefined : handleOpen}>{trigger}</div>

            {open && (
                <div
                    className={`fixed inset-0 bg-overlay flex items-center justify-center z-50 transition-opacity duration-200 px-[env(safe-area-inset-left)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
                        ${visible ? "opacity-100" : "opacity-0"}
                        ${className}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        close();
                    }}
                    onKeyDown={handleKeyDown}
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        tabIndex={-1}
                        className={`max-h-[calc(100dvh-2rem)] overflow-y-auto bg-surface rounded-xl px-4 py-4 md:px-6 min-w-0 max-w-lg w-full mx-3 transition-all duration-200 ${
                            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex justify-end mb-6 bg-surface">
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
