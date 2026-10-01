import { useEffect, useRef, useState } from 'react';

type AnimatedLabelProps =
{
    text: string; 
    error?: boolean;
    className?: string;
    splitColor?: boolean;
}

export const AnimatedLabel = ({ text, error, className, splitColor }: AnimatedLabelProps) => {
    const [displayed, setDisplayed] = useState(text);
    const [typing, setTyping] = useState(false);
    const targetRef = useRef(text);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (text === targetRef.current) return;
        targetRef.current = text;
        setTyping(true);

        const tick = (current: string, next: string) => {
            if (timerRef.current) clearTimeout(timerRef.current);

            if (current.length > 0) {
                timerRef.current = setTimeout(() => {
                    const trimmed = current.slice(0, -1);
                    setDisplayed(trimmed);
                    tick(trimmed, next);
                }, 40);
            } else {
                let i = 0;
                const type = () => {
                    if (i > next.length) { 
                        setTyping(false);
                        return; 
                    }
                    setDisplayed(next.slice(0, i));
                    i++;
                    timerRef.current = setTimeout(type, 40);
                };
                type();
            }
        };

        setDisplayed((cur) => { tick(cur, text); return cur; });

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [text]);

    const words = displayed.split(/([\s-])/g).filter(Boolean);
    const mid = Math.ceil(words.length / 2);

    return (
        <span className={`font-bold uppercase ${error ? 'text-accent' : ''} ${className}`}>
            {splitColor ? (
                <span className="inline">
                    {words.map((word, i) => (
                        <span 
                            key={i}
                            className={`transition-colors duration-700 ${i < mid ? 'text-accent' : 'text-primary'}`}
                        >
                            {word}
                        </span>
                    ))}
                </span>
            ) : (
                displayed || '\u00A0'
            )}
            {typing && <span style={{ animation: 'blink 0.2s step-start infinite' }}>|</span>}
            <style>{`@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
        </span>
    );
};
