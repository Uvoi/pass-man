import { Pencil, Trash2 } from "lucide-react";

type PassContextMenuProps = {
    x: number;
    y: number;
    onEdit: () => void;
    onDelete: () => void;
};

export const PassContextMenu = ({ x, y, onEdit, onDelete }: PassContextMenuProps) => {
    return (
        <div
            className="fixed z-100 min-w-48 rounded-lg border-2 border-border bg-surface p-1 shadow-xl"
            style={{
                left: x,
                top: y,
            }}
            onClick={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-text hover:bg-primary hover:text-accent"
            >
                <Pencil size={18} />
                Edit
            </button>

            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-text hover:bg-primary hover:text-error"
            >
                <Trash2 size={18} />
                Delete
            </button>
        </div>
    );
};
