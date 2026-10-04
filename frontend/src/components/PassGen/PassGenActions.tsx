import { Eye, X } from "lucide-react";

import type { GenerateSettings } from "../Generate/generate";

import { Button } from "../Button/Button";

import { SettingsModal } from "../Modal/SettingsModal";

import { AnimatedLabel } from "../Button/AnimatedLabel";


type PassGenActionsProps = {
    settings: GenerateSettings;
    loading: boolean;
    errorMsg: string;
    addToPassMan: boolean;

    onGenerate: () => void;
    onSettingsChange: (settings: GenerateSettings) => void;
    onReset: () => void;
    onAddToPassManChange: (
        value: boolean,
    ) => void;
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
}: PassGenActionsProps) =>
{
    return (
        <div
            className="
                flex flex-col
                gap-3
                w-full
            "
        >
            <div className="flex gap-2 w-full">
                <Button
                    onClick={onGenerate}
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? (
                            <Eye
                                size={30}
                                strokeWidth={3}
                                className="
                                    animate-spin
                                    text-accent
                                "
                            />
                        )
                        : (
                            <AnimatedLabel
                                text={
                                    errorMsg ||
                                    "Generate"
                                }
                                error={!!errorMsg}
                            />
                        )
                    }
                </Button>

                <SettingsModal
                    settings={settings}
                    onChange={onSettingsChange}
                    disabled={loading}
                />

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
                    <X
                        size={30}
                        strokeWidth={3}
                    />
                </Button>
            </div>

            <label
                className="
                    flex
                    items-center
                    gap-2
                    text-text
                    cursor-pointer
                    select-none
                "
            >
                <input
                    type="checkbox"
                    checked={addToPassMan}
                    onChange={event =>
                        onAddToPassManChange(
                            event.target.checked,
                        )
                    }
                    disabled={loading}
                    className="accent-accent"
                />

                Add to PassMan
            </label>
        </div>
    );
};
