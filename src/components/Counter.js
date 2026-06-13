import { useRef, useEffect, useState } from "react";

/**
 * Counts up from 0 to `to` the first time it scrolls into view.
 */
export default function Counter({ to, duration = 1600, decimals = 0, prefix = "", suffix = "" }) {
    const ref = useRef(null);
    const started = useRef(false);
    const [val, setVal] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const step = (now) => {
                        const p = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                        setVal(to * eased);
                        if (p < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [to, duration]);

    const display = val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return (
        <span ref={ref}>
            {prefix}
            {display}
            {suffix}
        </span>
    );
}
