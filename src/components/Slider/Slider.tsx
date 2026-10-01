type SliderProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    display?: (v: number) => string;
    onChange: (v: number) => void;
};

export const Slider = ({ label, value, min, max, step = 1, display, onChange }: SliderProps) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between text-text">
            <span className="text-xl">{label}</span>
            <span className="text-xl">{display ? display(value) : value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary"
        />
    </div>
);
