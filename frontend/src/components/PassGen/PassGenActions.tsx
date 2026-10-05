import { Eye, X } from "lucide-react";

import { AnimatedLabel, Button } from "../Button";
import type { GenerateSettings } from "../Generate";
import { SettingsModal } from "../Modal";

type PassGenActionsProps = {
    settings: GenerateSettings;
    loading: boolean;
    errorMsg: string;
    addToPassMan: boolean;

    onGenerate: () => void;
    onSettingsChange: (settings: GenerateSettings) => void;
    onReset: () => void;
    onAddToPassManChange: (value: boolean) => void;
};

export const PassGenActions = ({
    settings,
    loading,
    errorMsg,
    addToPassMan,

    onGenerate,
    onSettingsChange,
    onReset,
    onAddToPassManChange,
}: PassGenActionsProps) => {
    return (
        <div
            className="
                flex flex-col
                gap-3
                w-full
            "
        >
            <div className="flex gap-2 w-full">
                <Button onClick={onGenerate} className="w-full" disabled={loading}>
                    {loading ? (
                        <Eye
                            size={30}
                            strokeWidth={3}
                            className="
                                    animate-spin
                                    text-accent
                                "
                        />
                    ) : (
                        <AnimatedLabel text={errorMsg || "Generate"} error={!!errorMsg} />
                    )}
                </Button>

                <SettingsModal settings={settings} onChange={onSettingsChange} disabled={loading} className="z-100"/>

                <Button
                    onClick={onReset}
                    className="
                        w-fit
                        bg-accent!
                        text-primary!
                        active:text-text-dark!
                        active:bg-muted!
                        hover:text-text-dark!
                    "
                    disabled={loading}
                >
                    <X size={30} strokeWidth={3} />
                </Button>
            </div>

            <div className="flex items-center gap-3 rounded-lg border-2 border-border px-3 py-2">
                <input
                    id="add-to-pass-man"
                    type="checkbox"
                    checked={addToPassMan}
                    onChange={(event) => onAddToPassManChange(event.target.checked)}
                    disabled={loading}
                    className="h-5 w-5 accent-primary"
                />
                <label
                    htmlFor="add-to-pass-man"
                    className="min-w-0 flex-1 text-xl text-text cursor-pointer select-none"
                >
                    Add to PassMan
                </label>
            </div>
        </div>
    );
};
