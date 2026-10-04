import { Input } from "../Input";

type PassGenFormProps = {
    masterKey: string;
    passKey: string;
    tag: string;

    masterKeyError: boolean;
    keyError: boolean;
    disabled: boolean;

    onMasterKeyChange: (value: string) => void;
    onKeyChange: (value: string) => void;
    onTagChange: (value: string) => void;
};

export const PassGenForm = ({
    masterKey,
    passKey,
    tag,

    masterKeyError,
    keyError,
    disabled,

    onMasterKeyChange,
    onKeyChange,
    onTagChange,
}: PassGenFormProps) => {
    return (
        <div
            className="
                w-full
                flex flex-col
                gap-6
                justify-center
            "
        >
            <Input
                value={masterKey}
                onChange={onMasterKeyChange}
                placeholder="Master password*"
                type="password"
                rightAddon={["visible", "clear"]}
                error={masterKeyError}
                disabled={disabled}
            />

            <Input
                value={passKey}
                onChange={onKeyChange}
                placeholder="Key*"
                error={keyError}
                disabled={disabled}
                rightAddon="clear"
            />

            <Input
                value={tag}
                onChange={onTagChange}
                placeholder="Tag"
                disabled={disabled}
                rightAddon="clear"
            />
        </div>
    );
};
