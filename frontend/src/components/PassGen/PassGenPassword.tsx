import { Input } from "../Input/Input";


type PassGenPasswordProps = {
    password: string;
};


export const PassGenPassword = ({
    password,
}: PassGenPasswordProps) =>
{
    return (
        <Input
            value={password}
            placeholder="Wait ur password"
            rightAddon="copy"
            disabled
            className=""
        />
    );
};
