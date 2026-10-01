type ParamProps = {
    label: string;
    value?: string | number;
    onClick?: () => void;
};

export const Param = ({ label, value, onClick }: ParamProps) =>
{
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`
                flex items-center gap-1
                px-2.5 py-1
                rounded-md
                bg-surface
                border border-border
                text-text
                transition-colors
                ${onClick
                    ? "hover:text-accent hover:border-accent cursor-pointer"
                    : "cursor-default"
                }
            `}
        >
            <span className="text-accent font-semibold">
                {label}
            </span>

            {value !== undefined && (
                <span>
                    {value}
                </span>
            )}
        </button>
    );
};