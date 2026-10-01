

import type { PassItem } from "../../types/pass";
import { Param } from "./Param";
import { PasswordActions } from "./PasswordActions";

type PassRowProps = {
    item: PassItem;
    password?: string;
    onView: () => void;
    onCopy: () => void;
    onCustomAlphabet: () => void;
    onContextMenu: (x: number, y: number) => void;
};

export const PassRow = ({
    item,
    password,
    onView,
    onCopy,
    onCustomAlphabet,
    onContextMenu,
}: PassRowProps) =>
{
    const { params } = item;

    const alphabet =
        (params.selectedGroups.letters ? "L" : "") +
        (params.selectedGroups.digits ? "N" : "") +
        (params.selectedGroups.special ? "S" : "");

    const memory = Math.round(params.memorySize / 1024);

    const hasCustomAlphabet = params.customAlphabet.length > 0;

    const visible = Boolean(password);

    return (
        <div
            className="
                grid
                md:grid-cols-[1fr_1fr_2fr_2fr]
                gap-4
                px-6 py-5
                bg-bg
                hover:bg-surface
                transition-colors
            "
            onContextMenu={(event) =>
            {
                event.preventDefault();

                onContextMenu(
                    event.clientX,
                    event.clientY,
                );
            }}
        >
            {/* Key */}
            <div className="flex flex-col justify-center gap-1 min-w-0">
                <span className="md:hidden text-sm text-text/50">
                    Key
                </span>

                <span className="text-text text-lg font-medium truncate">
                    {item.key}
                </span>
            </div>

            {/* Tag */}
            <div className="flex items-center min-w-0">
                <span className="md:hidden text-sm text-text/50 mr-2">
                    Tag
                </span>

                <span className="px-3 py-1 rounded-md bg-primary text-text truncate">
                    {item.tag}
                </span>
            </div>

            {/* Password */}
            <div className="flex flex-col justify-center gap-1 min-w-0">
                <span className="md:hidden text-sm text-text/50">
                    Password
                </span>

                <div className="flex items-center gap-2 min-w-0">
                    <div className="min-w-0 flex-1 overflow-x-auto hide-scrollbar">
                        <span className="font-mono text-lg text-text whitespace-nowrap">
                            {password ?? "••••••••••••••••"}
                        </span>
                    </div>

                    <PasswordActions
                        visible={visible}
                        onView={onView}
                        onCopy={onCopy}
                    />
                </div>
            </div>

            {/* Parameters */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="md:hidden w-full text-sm text-text/50">
                    Parameters
                </span>

                <Param
                    label="i"
                    value={params.iterations}
                />

                <Param
                    label="m"
                    value={memory}
                />

                <Param
                    label="pl"
                    value={params.hashLength}
                />

                {alphabet && (
                    <Param
                        label="a"
                        value={alphabet}
                    />
                )}

                {hasCustomAlphabet && (
                    <Param
                        label="ca"
                        onClick={onCustomAlphabet}
                    />
                )}
            </div>
        </div>
    );
};