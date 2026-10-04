import type { PassItem } from "../../types/pass";
import { PassRow } from "./PassRow";


type PassManTableProps = {
    loading: boolean;
    passwords: PassItem[];
    generatedPasswords: Record<number, string>;

    onView: (item: PassItem) => void;
    onCopy: (item: PassItem) => void;
    onCustomAlphabet: (item: PassItem) => void;
    onContextMenu: (
        x: number,
        y: number,
        item: PassItem,
    ) => void;
};


export const PassManTable = ({
    loading,
    passwords,
    generatedPasswords,
    onView,
    onCopy,
    onCustomAlphabet,
    onContextMenu,
}: PassManTableProps) =>
{
    if (loading)
    {
        return (
            <div className="text-text/50">
                Loading...
            </div>
        );
    }


    return (
        <div
            className="
                w-full overflow-hidden
                rounded-xl border-2 border-border
            "
        >
            <div
                className="
                    hidden md:grid
                    grid-cols-[1fr_1fr_2fr_2fr]
                    gap-4
                    px-6 py-4
                    bg-surface
                    text-text
                    font-semibold
                "
            >
                <div>
                    Key
                </div>

                <div>
                    Tag
                </div>

                <div>
                    Password
                </div>

                <div>
                    Parameters
                </div>
            </div>

            <div className="divide-y-2 divide-border">
                {passwords.map(item => (
                    <PassRow
                        key={item.id}
                        item={item}
                        password={generatedPasswords[item.id]}
                        onView={() => onView(item)}
                        onCopy={() => onCopy(item)}
                        onCustomAlphabet={() =>
                            onCustomAlphabet(item)
                        }
                        onContextMenu={(x, y) =>
                            onContextMenu(
                                x,
                                y,
                                item,
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
};