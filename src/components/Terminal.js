import { useEffect, useRef, useState } from "react";

/* The fake CLI session that types itself out on a loop. */
const SCRIPT = [
    { type: "cmd", text: "stellar wallet connect --network testnet" },
    { type: "out", tone: "ok",     text: "Freighter detected" },
    { type: "out", tone: "ok",     text: "Wallet connected · GBN4XQ7…PL7K2Q" },
    { type: "cmd", text: "stellar balance --asset XLM" },
    { type: "out", tone: "amount", text: "XLM   10,000.0000" },
    { type: "cmd", text: "stellar pay --to GDX2H9…A1F0 --amount 250" },
    { type: "spin", text: "Signing & submitting to Horizon…" },
    { type: "out", tone: "ok",     text: "Confirmed in 4.18s" },
    { type: "out", tone: "dim",    text: "hash 7f3a9c41d8…b6e21b" },
    { type: "out", tone: "amount", text: "XLM    9,750.0000" },
];

/* Small braille spinner that cycles frames on an interval. */
function Spinner() {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setI(p => (p + 1) % frames.length), 80);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <span className="term-spin">{frames[i]}</span>;
}

function Line({ line }) {
    if (line.type === "cmd")
        return (
            <div className="term-line">
                <span className="term-prompt">➜</span>
                <span className="term-dir">stellar</span>
                <span className="term-cmd">{line.text}</span>
            </div>
        );
    if (line.type === "spin")
        return (
            <div className="term-line term-out">
                <Spinner /> <span className="term-dim">{line.text}</span>
            </div>
        );
    const glyph = line.tone === "ok" ? "✓" : line.tone === "amount" ? "›" : " ";
    return (
        <div className={`term-line term-out term-${line.tone}`}>
            <span className="term-glyph">{glyph}</span>
            <span>{line.text}</span>
        </div>
    );
}

export default function Terminal() {
    const [lines, setLines]   = useState([]);   // committed lines
    const [typed, setTyped]   = useState("");    // command currently being typed
    const [typing, setTyping] = useState(false);
    const bodyRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const timers = [];
        const wait = ms => new Promise(res => timers.push(setTimeout(res, ms)));

        const run = async () => {
            while (!cancelled) {
                setLines([]); setTyped(""); setTyping(false);
                await wait(500);

                for (const step of SCRIPT) {
                    if (cancelled) return;

                    if (step.type === "cmd") {
                        setTyping(true);
                        for (let i = 1; i <= step.text.length; i++) {
                            if (cancelled) return;
                            setTyped(step.text.slice(0, i));
                            await wait(34 + Math.random() * 46);
                        }
                        await wait(360);
                        setTyping(false);
                        setTyped("");
                        setLines(prev => [...prev, step]);
                        await wait(260);
                    } else if (step.type === "spin") {
                        setLines(prev => [...prev, step]);
                        await wait(1500);
                    } else {
                        setLines(prev => [...prev, step]);
                        await wait(420);
                    }
                }
                await wait(2800);   // hold the finished screen, then restart
            }
        };

        run();
        return () => { cancelled = true; timers.forEach(clearTimeout); };
    }, []);

    // keep the newest line in view as the session grows
    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [lines, typed]);

    return (
        <div className="term-window">
            <div className="term-titlebar">
                <div className="term-dots">
                    <span className="term-dot term-dot-red" />
                    <span className="term-dot term-dot-yellow" />
                    <span className="term-dot term-dot-green" />
                </div>
                <div className="term-title">stellar — zsh — 80×24</div>
                <div className="term-dots-spacer" />
            </div>

            <div className="term-body" ref={bodyRef}>
                {lines.map((line, i) => <Line key={i} line={line} />)}

                {typing && (
                    <div className="term-line">
                        <span className="term-prompt">➜</span>
                        <span className="term-dir">stellar</span>
                        <span className="term-cmd">{typed}</span>
                        <span className="term-cursor" />
                    </div>
                )}
            </div>
        </div>
    );
}
