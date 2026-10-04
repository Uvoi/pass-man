import { Pencil, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "../Button";
import type { CharsetGroupKey, GenerateSettings } from "../Generate";
import { defaultCharsetGroups, getCharset, normalizeCharset } from "../Generate";
import { Slider } from "../Slider";
import { Modal } from "./Modal";

type SettingsModalProps = {
    settings: GenerateSettings;
    onChange: (s: GenerateSettings) => void;
    disabled?: boolean;
};

const charsetKeys = Object.keys(defaultCharsetGroups) as CharsetGroupKey[];

const charsToEditValue = (value: string) => Array.from(value).join(",");

const editValueToChars = (value: string) =>
    normalizeCharset(
        value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
            .join(""),
    );

type CharsetEditModalProps = {
    label: string;
    chars: string;
    onChange: (value: string) => void;
};

const CharsetEditModal = ({ label, chars, onChange }: CharsetEditModalProps) => {
    const [value, setValue] = useState(charsToEditValue(chars));
    const parsedChars = editValueToChars(value);

    const handleApply = (close: () => void) => {
        onChange(parsedChars);
        close();
    };

    return (
        <Modal
            trigger={
                <Button
                    onClick={() => {}}
                    className="aspect-square p-2! bg-transparent hover:text-accent"
                >
                    <Pencil size={24} strokeWidth={3} />
                </Button>
            }
            onOpen={() => setValue(charsToEditValue(chars))}
        >
            {(close) => (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-text text-xl">{label}</span>
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="min-h-32 resize-y rounded-lg border-2 border-border bg-transparent p-3 text-xl text-text focus-visible:outline-none"
                        />
                        <span className="text-text text-sm opacity-70">
                            {parsedChars.length} symbols
                        </span>
                    </div>
                    <Button onClick={() => handleApply(close)} className="w-full">
                        Apply
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export const SettingsModal = ({ settings, onChange, disabled }: SettingsModalProps) => {
    const [local, setLocal] = useState(settings);

    const update = (key: keyof GenerateSettings, value: number) =>
        setLocal((prev) => ({ ...prev, [key]: value }));

    const updateSelectedGroup = (key: CharsetGroupKey, value: boolean) =>
        setLocal((prev) => ({
            ...prev,
            selectedGroups: {
                ...prev.selectedGroups,
                [key]: value,
            },
        }));

    const updateCharsetGroup = (key: CharsetGroupKey, value: string) =>
        setLocal((prev) => ({
            ...prev,
            charsetGroups: {
                ...prev.charsetGroups,
                [key]: value,
            },
        }));

    const updateCustomAlphabet = (value: string) =>
        setLocal((prev) => ({ ...prev, customAlphabet: normalizeCharset(value) }));

    const handleApply = (close: () => void) => {
        onChange(local);
        close();
    };

    const alphabetLength = getCharset(local).length;

    return (
        <Modal
            trigger={
                <Button
                    onClick={() => {}}
                    className="w-fit bg-accent! text-primary! active:text-text-dark! active:bg-muted! hover:text-text-dark!"
                    disabled={disabled}
                >
                    <Settings size={30} strokeWidth={3} />
                </Button>
            }
            onOpen={() => setLocal(settings)}
            disabled={disabled}
        >
            {(close) => (
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-8">
                        <Slider
                            label="Iterations"
                            value={local.iterations}
                            min={3}
                            max={10}
                            onChange={(v) => update("iterations", v)}
                        />
                        <Slider
                            label="Memory"
                            value={local.memorySize}
                            min={65536}
                            max={262144}
                            step={65536}
                            display={(v) => `${v / 1024}MB`}
                            onChange={(v) => update("memorySize", v)}
                        />
                        <Slider
                            label="Password length"
                            value={local.hashLength}
                            min={16}
                            max={32}
                            onChange={(v) => update("hashLength", v)}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-4 text-text">
                            <span className="text-xl">Alphabet</span>
                            <span className="text-xl">{alphabetLength}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {charsetKeys.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-3 rounded-lg border-2 border-border px-3 py-2"
                                >
                                    <input
                                        id={`charset-${key}`}
                                        type="checkbox"
                                        checked={local.selectedGroups[key]}
                                        onChange={(e) => updateSelectedGroup(key, e.target.checked)}
                                        className="h-5 w-5 accent-primary"
                                    />
                                    <label
                                        htmlFor={`charset-${key}`}
                                        className="min-w-0 flex-1 text-xl text-text"
                                    >
                                        {defaultCharsetGroups[key].label}
                                    </label>
                                    <span className="text-sm text-text opacity-70">
                                        {Array.from(local.charsetGroups[key]).length}
                                    </span>
                                    <CharsetEditModal
                                        label={defaultCharsetGroups[key].label}
                                        chars={local.charsetGroups[key]}
                                        onChange={(value) => updateCharsetGroup(key, value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <input
                            value={local.customAlphabet}
                            onChange={(e) => updateCustomAlphabet(e.target.value)}
                            placeholder="Custom alphabet"
                            className="rounded-lg border-2 border-border bg-transparent px-3 py-2 text-xl text-text focus-visible:outline-none"
                        />
                        {alphabetLength === 0 && (
                            <span className="text-error">Choose at least one symbol</span>
                        )}
                    </div>
                    <Button
                        onClick={() => handleApply(close)}
                        className="w-full"
                        disabled={alphabetLength === 0}
                    >
                        Apply
                    </Button>
                </div>
            )}
        </Modal>
    );
};
