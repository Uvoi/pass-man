import { useEffect, useState } from "react";

import { AnimatedLabel } from "../Button";

const PHRASES = [
    "same input, same key",
    "nothing random here",
    "deterministic magic",
    "reproducible result",
    "your key, always",
    "no storage needed",
];

type TitleProps = {
    trigger: number;
    defaultText?: string;
};

export const Title = ({ trigger, defaultText }: TitleProps) => {
    const [text, setText] = useState(defaultText || "pass-man");

    useEffect(() => {
        if (trigger === 0) return;
        const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        const phraseTimer = setTimeout(() => setText(phrase), 0);
        const resetTimer = setTimeout(() => setText(defaultText || "pass-man"), 3000);
        return () => {
            clearTimeout(phraseTimer);
            clearTimeout(resetTimer);
        };
    }, [defaultText, trigger]);

    return (
        <AnimatedLabel
            text={text}
            className="text-text text-3xl absolute top-[5%] left-1/2 -translate-x-1/2 xl:text-5xl"
            splitColor
        />
    );
};
