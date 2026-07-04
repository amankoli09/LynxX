import { useRef, useEffect, useState } from "react";

/**
 * Fades + slides its children in the first time they scroll into view.
 * Usage: <Reveal delay={120}>…</Reveal>
 */
export default function Reveal({ children, className = "", delay = 0, style = {}, as: Tag = "div", ...rest }) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            {...rest}
            ref={ref}
            className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
            style={{ ...style, transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}
