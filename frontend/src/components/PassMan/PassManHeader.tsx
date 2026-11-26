import { Download, Upload } from "lucide-react";

type PassManHeaderProps = {
    isAuthenticated: boolean;
    onChangeManagerPassword: () => void;
    onExport?: () => void;
    onImport?: () => void;
    busy?: boolean;
};

export const PassManHeader = ({
    isAuthenticated,
    onChangeManagerPassword,
    onExport,
    onImport,
    busy,
}: PassManHeaderProps) => {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-text text-2xl">Passwords</div>

            <div className="flex flex-wrap items-center gap-2">
                {onImport && (
                    <button
                        type="button"
                        onClick={onImport}
                        disabled={busy}
                        className="flex min-h-11 items-center gap-2 rounded-lg border-2 border-border px-3 text-text hover:text-accent disabled:opacity-50"
                    >
                        <Upload size={18} /> Import
                    </button>
                )}
                {onExport && (
                    <button
                        type="button"
                        onClick={onExport}
                        disabled={busy}
                        className="flex min-h-11 items-center gap-2 rounded-lg border-2 border-border px-3 text-text hover:text-accent disabled:opacity-50"
                    >
                        <Download size={18} /> Export
                    </button>
                )}
                <button
                    type="button"
                    onClick={onChangeManagerPassword}
                    className="min-h-11 text-left text-text hover:text-accent"
                >
                    {isAuthenticated ? "Change manager password" : "Enter manager password"}
                </button>
            </div>
        </div>
    );
};
