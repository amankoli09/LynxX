"use client";
import { useState, useEffect, useCallback } from "react";
import { getInteractions } from "../lib/jsonbin";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const ACTION_META = {
  connect: { label: "Connected",  emoji: "🔗", color: "#6ee7b7", bg: "rgba(16,185,129,0.12)" },
  send:    { label: "Sent XLM",   emoji: "📤", color: "#93c5fd", bg: "rgba(59,130,246,0.12)"  },
  donate:  { label: "Donated",    emoji: "💜", color: "#c4b5fd", bg: "rgba(139,92,246,0.12)"  },
};

/* ── Animated counter ────────────────────────────────────────────────────── */
function AnimCounter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}</>;
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function UserInteractions({ latestAddress }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all"); // all | connect | send | donate
  const [animated, setAnimated]         = useState(false);

  const load = useCallback(() => {
    try {
      const data = getInteractions();
      setInteractions(data);
      setLoading(false);
      setTimeout(() => setAnimated(true), 100);
    } catch {
      setLoading(false);
    }
  }, []);

  // Reload whenever a new interaction is recorded from the outside
  useEffect(() => { load(); }, [load, latestAddress]);

  const filtered = filter === "all"
    ? interactions
    : interactions.filter(i => i.action === filter);

  const uniqueWallets = new Set(interactions.map(i => i.address)).size;
  const totalDonations = interactions.filter(i => i.action === "donate").length;
  const totalSends     = interactions.filter(i => i.action === "send").length;

  return (
    <div className="ui-section">
      <style>{`
        .ui-section {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        /* ── Stats row ── */
        .ui-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .ui-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
        }
        .ui-stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .ui-stat-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(139,92,246,0.3);
          transform: translateY(-2px);
        }
        .ui-stat-num {
          font-size: 3rem;
          font-weight: 800;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
          background: linear-gradient(135deg, #c4b5fd, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .ui-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ── Filter tabs ── */
        .ui-filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .ui-filter-tab {
          padding: 7px 18px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }
        .ui-filter-tab:hover {
          border-color: rgba(139,92,246,0.4);
          color: rgba(255,255,255,0.8);
        }
        .ui-filter-tab.active {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.5);
          color: #c4b5fd;
        }

        /* ── Feed ── */
        .ui-feed {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .ui-feed::-webkit-scrollbar { width: 4px; }
        .ui-feed::-webkit-scrollbar-track { background: transparent; }
        .ui-feed::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }

        .ui-entry {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          opacity: 0;
          transform: translateY(8px);
          animation: ui-entry-in 0.35s ease forwards;
        }
        .ui-entry:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateX(4px);
        }
        @keyframes ui-entry-in {
          to { opacity: 1; transform: translateY(0); }
        }

        .ui-entry-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .ui-entry-body {
          flex: 1;
          min-width: 0;
        }
        .ui-entry-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .ui-entry-addr {
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          font-family: 'Space Grotesk', monospace;
        }
        .ui-entry-badge {
          padding: 2px 9px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ui-entry-sub {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.35);
        }

        .ui-entry-right {
          text-align: right;
          flex-shrink: 0;
        }
        .ui-entry-amount {
          font-size: 0.9rem;
          font-weight: 700;
          color: #c4b5fd;
          white-space: nowrap;
        }
        .ui-entry-time {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }

        /* ── Live badge ── */
        .ui-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #34d399;
          text-transform: uppercase;
        }
        .ui-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: ui-pulse 1.5s infinite;
        }
        @keyframes ui-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* ── Skeleton ── */
        .ui-skel {
          height: 64px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          animation: ui-shimmer 1.4s infinite linear;
          background-size: 200% 100%;
          background-image: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
        }
        @keyframes ui-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Empty state ── */
        .ui-empty {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .ui-stat-num { font-size: 2rem; }
          .ui-entry { padding: 12px 14px; gap: 12px; }
          .ui-entry-icon { width: 34px; height: 34px; font-size: 0.95rem; }
          .ui-feed { max-height: 360px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
        <div>
          <div className="ui-live-badge">
            <span className="ui-live-dot" />
            Live
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginTop: "14px", marginBottom: "8px", lineHeight: 1.1 }}>
            Real wallet interactions
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: "520px" }}>
            Every connect, send, and donation from real users — recorded on Stellar Testnet.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", textAlign: "right", alignSelf: "flex-end" }}>
          Updates with each new wallet action
        </div>
      </div>

      {/* Stats */}
      <div className="ui-stats-row">
        <div className="ui-stat-card">
          <div className="ui-stat-num">
            {loading ? "—" : <AnimCounter target={interactions.length} />}
          </div>
          <div className="ui-stat-label">Total Interactions</div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-num">
            {loading ? "—" : <AnimCounter target={uniqueWallets} />}
          </div>
          <div className="ui-stat-label">Unique Wallets</div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-num">
            {loading ? "—" : <AnimCounter target={totalDonations} />}
          </div>
          <div className="ui-stat-label">On-chain Donations</div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-num">
            {loading ? "—" : <AnimCounter target={totalSends} />}
          </div>
          <div className="ui-stat-label">XLM Transfers</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="ui-filter-tabs">
        {[
          { key: "all",     label: "All Activity" },
          { key: "connect", label: "🔗 Connects" },
          { key: "send",    label: "📤 Sends" },
          { key: "donate",  label: "💜 Donations" },
        ].map(tab => (
          <button
            key={tab.key}
            className={`ui-filter-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="ui-feed">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="ui-skel" style={{ animationDelay: `${i * 0.12}s` }} />
          ))
        ) : filtered.length === 0 ? (
          <div className="ui-empty">No {filter} interactions yet.</div>
        ) : (
          filtered.map((entry, i) => {
            const meta = ACTION_META[entry.action] || ACTION_META.connect;
            return (
              <div
                key={`${entry.timestamp}-${i}`}
                className="ui-entry"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
              >
                <div
                  className="ui-entry-icon"
                  style={{ background: meta.bg }}
                >
                  {meta.emoji}
                </div>

                <div className="ui-entry-body">
                  <div className="ui-entry-top">
                    <span className="ui-entry-addr">{entry.address}</span>
                    <span
                      className="ui-entry-badge"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <div className="ui-entry-sub">
                    {entry.hash ? `Tx: ${entry.hash}` : "Wallet connected to LynxX"}
                  </div>
                </div>

                <div className="ui-entry-right">
                  {entry.amount && (
                    <div className="ui-entry-amount">{entry.amount} XLM</div>
                  )}
                  <div className="ui-entry-time">{timeAgo(entry.timestamp)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
