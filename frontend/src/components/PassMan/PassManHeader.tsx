type PassManHeaderProps = {
    isAuthenticated: boolean;
    onChangeManagerPassword: () => void;
};


export const PassManHeader = ({
    isAuthenticated,
    onChangeManagerPassword,
}: PassManHeaderProps) =>
{
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="text-text text-2xl">
                Passwords
            </div>

            {isAuthenticated && (
                <button
                    type="button"
                    onClick={onChangeManagerPassword}
                    className="text-text hover:text-accent"
                >
                    Change manager password
                </button>
            )}
        </div>
    );
};