type ButtonProps = 
{
    onClick: () => void;
    children: React.ReactNode;
    leftAddon?: React.ReactNode;
    className?: string;
    disabled?:boolean;
}

export const Button = (props: ButtonProps) =>
{
    const {onClick, children, leftAddon, className, disabled} = props;

    return(
        <button onClick={onClick} disabled={disabled} className={
            `flex gap-4 items-center justify-center p-4 rounded-lg text-text bg-primary 
            hover:text-accent active:bg-primary-active active:text-accent 
            transition-colors duration-200
            disabled:opacity-50 disabled:pointer-events-none
            ${className}`
        }>
            {leftAddon}
            <span className="w-fill text-xl">{children}</span>
        </button>
    )
}