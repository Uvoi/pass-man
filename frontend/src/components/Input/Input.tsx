import { useState } from "react";
import { Eye, EyeOff, Copy, X } from "lucide-react";
import { Button } from "../Button/Button";

type InputProps = 
{
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    rightAddon?: 'visible' | 'copy' | 'clear' | ('visible' | 'copy' | 'clear')[];
    type?: 'text' | 'password';
    disabled?: boolean;
    error?: boolean;
}

export const Input = (props: InputProps) =>
{
    const {placeholder, value, onChange, className, rightAddon, type = 'text', disabled, error} = props;
    const addons = Array.isArray(rightAddon) ? rightAddon : rightAddon ? [rightAddon] : [];

    const [inputType, setInputType] = useState(type);

    const handleVisibleToggle = () =>
    {
        setInputType(prev => prev === 'text' ? 'password' : 'text');
    }

    const handleCopy = () =>
    {
        navigator.clipboard.writeText(value);
    }
    

    return(
        <div className={`flex items-stretch gap-2 border-2 rounded-lg h-fit overflow-hidden ${error ? 'border-error' : 'border-border'}`}>
            <input 
                className={
                    `text-text w-full h-full self-center py-2 px-2 text-xl focus-visible:outline-none ${className}`
                }
                type={inputType} 
                value={value} 
                placeholder={placeholder}
                onChange={e => onChange?.(e?.target.value)}
                disabled={disabled}
            />      
            <div className="flex w-fit">
                {addons.includes('visible') &&
                    <Button onClick={handleVisibleToggle} className="aspect-square hover:text-accent p-2! bg-transparent">
                        {inputType === "password" 
                            ? <Eye height={30} width={30}/> 
                            : <EyeOff height={30} width={30}/>
                        }
                    </Button>
                }
                {addons.includes('copy') &&
                    <Button onClick={handleCopy} className="aspect-square hover:text-accent p-2! bg-transparent">
                        <Copy height={30} width={30}/>
                    </Button>
                }
                {addons.includes('clear') &&
                    <Button onClick={() => onChange?.('')} className="aspect-square hover:text-accent p-2! bg-transparent">
                        <X height={30} width={30}/>
                    </Button>
                }
            </div>
        </div>
    )
}