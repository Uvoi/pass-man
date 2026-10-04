import { Copy, Eye, EyeOff } from "lucide-react";

type PasswordActionsProps = {
    visible: boolean;
    onView: () => void;
    onCopy: () => void;
};

export const PasswordActions = ({ visible, onView, onCopy }: PasswordActionsProps) => {
    return (
        <div className="flex shrink-0 items-center">
            <button
                type="button"
                onClick={onCopy}
                className="p-2 rounded-lg text-text hover:text-accent hover:bg-primary transition-colors"
                aria-label="Copy password"
            >
                <Copy size={23} />
            </button>

            <button
                type="button"
                onClick={onView}
                className="p-2 rounded-lg text-text hover:text-accent hover:bg-primary transition-colors"
                aria-label={visible ? "Hide password" : "Show password"}
            >
                {visible ? <EyeOff size={25} /> : <Eye size={25} />}
            </button>
        </div>
    );
};
