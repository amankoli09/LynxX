import { useState, useEffect } from "react";
import { getCampaign } from "./Fund";
import { Wallet, Users, Target, Flag } from "lucide-react";

/* ── Animated number helper ── */
function AnimNum({ value, decimals = 0, suffix = "" }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (value == null || isNaN(value)) return;
        let start = 0;
        const end = Number(value);
        const duration = 1200;
        const step = 16;
        const inc = end / (duration / step);
        const timer = setInterval(() => {
            start += inc;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(start);
        }, step);
        return () => clearInterval(timer);
    }, [value]);
    return <>{Number(display).toFixed(decimals)}{suffix}</>;
}

const GOAL_XLM = 1000;

export default function Analytics() {
    const [stats, setStats] = useState({ raisedXlm: null, donors: null, closed: false, loading: true, error: false });
    const [lastRefresh, setLastRefresh] = useState(null);

    const load = async () => {
        setStats(s => ({ ...s, loading: true, error: false }));
        try {
            const data = await getCampaign();
            setStats({ raisedXlm: data.raisedXlm, donors: data.donors, closed: data.closed, loading: false, error: false });
            setLastRefresh(new Date());
        } catch {
            setStats(s => ({ ...s, loading: false, error: true }));
        }
    };

    useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, []);

    const raisedXLM  = stats.raisedXlm != null ? Number(stats.raisedXlm).toFixed(2) : 0;
    const pct        = Math.min((raisedXLM / GOAL_XLM) * 100, 100).toFixed(1);
    const remaining  = Math.max(GOAL_XLM - raisedXLM, 0).toFixed(2);

    return (
        <div className="analytics-section-wrapper" style={{ width: '100%', maxWidth: 860, margin: '0 auto' }}>
            {/* Top Level Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <div className="lp-section-eyebrow mb-2 text-gray-400 font-bold tracking-widest text-xs">ON-CHAIN DATA</div>
                    <h2 className="lp-section-title text-4xl font-extrabold mb-2 text-white">Live campaign analytics</h2>
                    <p className="text-gray-400 text-sm">Real-time insights from the Soroban smart contract on Stellar Testnet.</p>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <div className="analytics-network-badge flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400">
                        <span className="analytics-network-dot w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-emerald-500 font-bold tracking-widest mr-2">LIVE</span>
                        Stellar Testnet — Soroban RPC
                    </div>
                    {lastRefresh && (
                        <span className="analytics-refresh-time text-xs text-gray-500 flex items-center gap-2">
                            Updated {lastRefresh.toLocaleTimeString()}
                            <button className="analytics-refresh-btn hover:text-white transition-colors" onClick={load} title="Refresh">↻</button>
                        </span>
                    )}
                </div>
            </div>

            <div className="analytics-panel mt-0 mx-0 w-full max-w-full">
                <div className="analytics-header">
                    <div className="analytics-title-row">
                        <span className="analytics-eyebrow">LIVE ON-CHAIN DATA</span>
                        <span className="analytics-divider">|</span>
                        <div className="analytics-live-dot">
                            <span className="analytics-pulse" />
                            <span className="analytics-live-text">LIVE</span>
                        </div>
                    </div>
                    <h3 className="analytics-title">Campaign Analytics</h3>
                    <p className="analytics-sub">Real-time stats pulled directly from the Soroban smart contract on Stellar Testnet.</p>
                </div>

            {stats.error ? (
                <div className="analytics-error">
                    <span>⚠️ Could not reach the contract. </span>
                    <button className="analytics-retry" onClick={load}>Retry</button>
                </div>
            ) : (
                <>
                    <div className="analytics-grid">
                        {/* XLM Raised */}
                        <div className="analytics-card analytics-card-accent">
                            <div className="analytics-card-icon">
                                <Wallet className="text-white opacity-80" strokeWidth={1.5} size={28} />
                            </div>
                            <div className="analytics-card-value">
                                {stats.loading ? <span className="analytics-skeleton" /> :
                                    <><AnimNum value={raisedXLM} decimals={2} /> <span className="analytics-unit">XLM</span></>}
                            </div>
                            <div className="analytics-card-label">Total Raised</div>
                        </div>

                        {/* Unique Donors */}
                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                <Users className="text-white opacity-80" strokeWidth={1.5} size={28} />
                            </div>
                            <div className="analytics-card-value">
                                {stats.loading ? <span className="analytics-skeleton" /> :
                                    <><AnimNum value={stats.donors} decimals={0} /></>}
                            </div>
                            <div className="analytics-card-label">Unique Donors</div>
                        </div>

                        {/* Remaining */}
                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                <Target className="text-white opacity-80" strokeWidth={1.5} size={28} />
                            </div>
                            <div className="analytics-card-value">
                                {stats.loading ? <span className="analytics-skeleton" /> :
                                    <><AnimNum value={remaining} decimals={2} /> <span className="analytics-unit">XLM</span></>}
                            </div>
                            <div className="analytics-card-label">Until Goal</div>
                        </div>

                        {/* Goal */}
                        <div className="analytics-card">
                            <div className="analytics-card-icon">
                                <Flag className="text-white opacity-80" strokeWidth={1.5} size={28} />
                            </div>
                            <div className="analytics-card-value">
                                1,000 <span className="analytics-unit">XLM</span>
                            </div>
                            <div className="analytics-card-label">Campaign Goal</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="analytics-progress-wrap">
                        <div className="analytics-progress-head">
                            <span className="analytics-progress-label">Campaign Progress</span>
                            <span className="analytics-progress-pct">
                                {stats.loading ? "—" : `${pct}%`}
                            </span>
                        </div>
                        <div className="analytics-progress-track">
                            <div
                                className="analytics-progress-bar"
                                style={{ width: stats.loading ? "0%" : `${pct}%` }}
                            />
                        </div>
                        <div className="analytics-progress-foot">
                            <span>{stats.loading ? "—" : `${raisedXLM} XLM raised`}</span>
                            <span>Goal: {GOAL_XLM} XLM</span>
                        </div>
                    </div>

                </>
            )}
        </div>
        </div>
    );
}
