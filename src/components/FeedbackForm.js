"use client";
// Arrow icon matching cf-hero-cta-icon style
const ArrowIcon = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 34, height: 34, borderRadius: "50%",
    background: "#fff", color: "#6c38ff", flexShrink: 0,
  }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  </div>
);
import { useState, useEffect, useCallback } from "react";
import { getFeedback, submitFeedback } from "../lib/jsonbin";

/* ── Star Rating Input ──────────────────────────────────────────────────── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem",
            lineHeight: 1,
            color: n <= (hovered || value) ? "#FFB800" : "rgba(255,255,255,0.15)",
            transition: "color 0.15s, transform 0.15s",
            transform: n <= (hovered || value) ? "scale(1.2)" : "scale(1)",
            padding: "2px",
          }}
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ── Feedback Card ──────────────────────────────────────────────────────── */
function FeedbackCard({ entry, index }) {
  return (
    <div
      className="fb-card"
      style={{ animationDelay: `${Math.min(index * 0.07, 0.5)}s` }}
    >
      <div className="fb-card-stars">
        {"★".repeat(entry.rating)}
        <span style={{ color: "rgba(255,255,255,0.15)" }}>
          {"★".repeat(5 - entry.rating)}
        </span>
      </div>
      <p className="fb-card-comment">"{entry.comment}"</p>
      <div className="fb-card-footer">
        <div className="fb-card-avatar">
          {(entry.name || "?")[0].toUpperCase()}
        </div>
        <div>
          <div className="fb-card-name">{entry.name || "Anonymous"}</div>
          <div className="fb-card-wallet">{entry.wallet}</div>
        </div>
        <div className="fb-card-date">
          {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function FeedbackForm({ prefillWallet = "" }) {
  // Form state
  const [name,    setName]    = useState("");
  const [wallet,  setWallet]  = useState(prefillWallet);
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState("");
  const [stage,   setStage]   = useState("idle"); // idle | submitting | success | error
  const [errMsg,  setErrMsg]  = useState("");

  // Feedback entries
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Pre-fill wallet when prop changes (user connects wallet)
  useEffect(() => { if (prefillWallet) setWallet(prefillWallet); }, [prefillWallet]);

  const load = useCallback(async () => {
    try {
      const data = await getFeedback();
      setEntries(data || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const avgRating = entries.length
    ? (entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(1)
    : "—";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setErrMsg("Please select a star rating."); return; }
    if (!comment.trim()) { setErrMsg("Please write a short comment."); return; }
    setErrMsg("");
    setStage("submitting");
    try {
      const updated = await submitFeedback({ name: name.trim() || "Anonymous", wallet, rating, comment: comment.trim() });
      setEntries(Array.isArray(updated) ? updated : entries);
      setStage("success");
      // Reset form after 2s
      setTimeout(() => {
        setName(""); setRating(0); setComment(""); setStage("idle");
      }, 3000);
    } catch (err) {
      console.error(err);
      setStage("error");
      setErrMsg(err.message.includes("not configured") 
        ? "Database not configured. Feedback cannot be saved globally." 
        : "Something went wrong. Please try again.");
      setTimeout(() => setStage("idle"), 4000);
    }
  };

  return (
    <div className="fb-wrapper">
      <style>{`
        .fb-wrapper { width: 100%; max-width: 1080px; margin: 0 auto; }

        /* ── Summary bar ── */
        .fb-summary {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .fb-big-rating {
          font-size: 4rem;
          font-weight: 900;
          font-family: 'Space Grotesk', sans-serif;
          background: linear-gradient(135deg, #FFB800, #FF6B00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .fb-stars-display {
          font-size: 1.4rem;
          color: #FFB800;
          letter-spacing: 3px;
          margin-bottom: 4px;
        }
        .fb-total-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .fb-divider {
          width: 1px;
          height: 60px;
          background: rgba(255,255,255,0.1);
        }
        .fb-pill {
          padding: 8px 20px;
          border-radius: 100px;
          background: rgba(255,184,0,0.1);
          border: 1px solid rgba(255,184,0,0.2);
          color: #FFB800;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* ── Grid ── */
        .fb-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 768px) { .fb-grid { grid-template-columns: 1fr; } }

        /* ── Form card ── */
        .fb-form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px;
          position: sticky;
          top: 100px;
        }
        .fb-form-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #fff;
        }
        .fb-form-sub {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 28px;
        }
        .fb-field {
          margin-bottom: 20px;
        }
        .fb-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .fb-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          resize: none;
        }
        .fb-input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.05);
        }
        .fb-input::placeholder { color: rgba(255,255,255,0.2); }
        .fb-error {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 10px;
        }
        .fb-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #6c38ff;
          border: none;
          border-radius: 100px;
          padding: 6px 6px 6px 20px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(108, 56, 255, 0.4);
          margin-top: 12px;
          width: 100%;
          justify-content: space-between;
        }
        .fb-submit-btn:hover:not(:disabled) {
          background: #5b2ee5;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(108,56,255,0.5);
        }
        .fb-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .fb-success-msg {
          text-align: center;
          padding: 20px;
          color: #6ee7b7;
          font-size: 1rem;
          font-weight: 600;
        }

        /* ── Feed ── */
        .fb-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .fb-feed::-webkit-scrollbar { width: 4px; }
        .fb-feed::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }

        .fb-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          animation: fb-in 0.35s ease forwards;
          opacity: 0;
        }
        .fb-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
        @keyframes fb-in { to { opacity: 1; } }

        .fb-card-stars {
          font-size: 1rem;
          margin-bottom: 12px;
          letter-spacing: 2px;
          color: #FFB800;
        }
        .fb-card-comment {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
          font-style: italic;
          margin: 0 0 18px 0;
        }
        .fb-card-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fb-card-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .fb-card-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #fff;
        }
        .fb-card-wallet {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
          font-family: 'Space Grotesk', monospace;
        }
        .fb-card-date {
          margin-left: auto;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
        }

        /* ── Skeleton ── */
        .fb-skel {
          height: 120px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          animation: fb-shimmer 1.4s infinite linear;
          background-size: 200% 100%;
          background-image: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
        }
        @keyframes fb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Spinner ── */
        .fb-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: fb-spin 0.7s linear infinite;
        }
        @keyframes fb-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "14px" }}>
          User Feedback
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginBottom: "12px", lineHeight: 1.1 }}>
          What users are saying
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: "520px" }}>
          Real feedback from users who have connected their wallets and explored LynxX.
          Your review helps us improve.
        </p>
      </div>

      {/* Summary bar */}
      <div className="fb-summary">
        <div className="fb-big-rating">{avgRating}</div>
        <div>
          <div className="fb-stars-display">★★★★★</div>
          <div className="fb-total-label">{entries.length} Reviews</div>
        </div>
        <div className="fb-divider" />
        <div className="fb-pill">⭐ Verified Testnet Users</div>
      </div>

      {/* Grid: form + feed */}
      <div className="fb-grid">
        {/* Form */}
        <div className="fb-form-card">
          <div className="fb-form-title">Leave your feedback</div>
          <div className="fb-form-sub">Takes 30 seconds. No sign-up required.</div>

          {stage === "success" ? (
            <div className="fb-success-msg">
              ✅ Thank you! Your feedback has been saved.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="fb-field">
                <label className="fb-label">Your Name (optional)</label>
                <input
                  className="fb-input"
                  type="text"
                  placeholder="e.g. Maya R."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="fb-field">
                <label className="fb-label">Wallet Address (optional)</label>
                <input
                  className="fb-input"
                  type="text"
                  placeholder="G... (auto-filled when wallet is connected)"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  maxLength={60}
                  style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "0.82rem" }}
                />
              </div>

              <div className="fb-field">
                <label className="fb-label">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="fb-field">
                <label className="fb-label">Comment</label>
                <textarea
                  className="fb-input"
                  rows={4}
                  placeholder="What did you think of LynxX? What worked well?"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                />
              </div>

              {errMsg && <div className="fb-error">{errMsg}</div>}

              <button
                type="submit"
                className="fb-submit-btn"
                disabled={stage === "submitting"}
                id="btn-submit-feedback"
              >
                {stage === "submitting" ? (
                  <>
                    <span>Saving...</span>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'center', width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.3)',flexShrink:0 }}>
                      <div className="fb-spinner" />
                    </div>
                  </>
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <ArrowIcon />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Feed */}
        <div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "16px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
            Recent reviews — {entries.length} total
          </div>
          <div className="fb-feed">
            {loading ? (
              [120, 100, 140].map((h, i) => (
                <div key={i} className="fb-skel" style={{ height: h, animationDelay: `${i * 0.15}s` }} />
              ))
            ) : (
              entries.map((entry, i) => (
                <FeedbackCard key={`${entry.timestamp}-${i}`} entry={entry} index={i} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
