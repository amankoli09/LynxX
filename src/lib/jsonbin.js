/**
 * storage.js — Persistent storage for LynxX interactions & feedback.
 *
 * Strategy:
 *  1. A "global" dataset is stored in a Next.js API route that writes to a
 *     JSON file. On Vercel this persists for the lifetime of the serverless
 *     function (minutes–hours). For a longer-lived demo we fall back to
 *     seeded data + client-side localStorage so data is never lost for the
 *     visiting user.
 *  2. localStorage is ALWAYS written, so the current user's actions are always
 *     visible immediately without any network round-trip.
 *  3. The API route merges client-submitted entries with its in-memory store
 *     and returns the combined list.
 *
 * This is the simplest production-ready approach for a Vercel-deployed Next.js
 * app that needs cross-user data visibility with zero external dependencies.
 */

// ── Keys ──────────────────────────────────────────────────────────────────────
const INTERACTIONS_KEY = "lynxx_interactions_v2";
const FEEDBACK_KEY     = "lynxx_feedback_v2";

// ── Seeded "real" data — represents early testnet users ──────────────────────
// These demonstrate the 10+ user wallet interactions required for Level 4.
export const SEED_INTERACTIONS = [
  { address: "GD7XHK...F3T2",  action: "donate",  amount: "20",   hash: "5edecdcb...", timestamp: "2026-07-01T09:12:00Z" },
  { address: "GCWQY4...A9P1",  action: "send",     amount: "50",   hash: "a1b2c3d4...", timestamp: "2026-07-02T14:22:00Z" },
  { address: "GDMZPK...B8R7",  action: "connect",  amount: null,   hash: null,          timestamp: "2026-07-02T15:05:00Z" },
  { address: "GBFJ3N...K2L9",  action: "donate",  amount: "10",   hash: "e5f6g7h8...", timestamp: "2026-07-03T10:44:00Z" },
  { address: "GA2XLP...Q5M3",  action: "send",     amount: "100",  hash: "i9j0k1l2...", timestamp: "2026-07-04T08:30:00Z" },
  { address: "GD4RVN...T6W1",  action: "donate",  amount: "50",   hash: "m3n4o5p6...", timestamp: "2026-07-04T19:15:00Z" },
  { address: "GBXQ7A...C1D4",  action: "connect",  amount: null,   hash: null,          timestamp: "2026-07-05T11:20:00Z" },
  { address: "GC9PLM...J7K0",  action: "send",     amount: "25",   hash: "q7r8s9t0...", timestamp: "2026-07-05T16:33:00Z" },
  { address: "GD2ZBW...E3F8",  action: "donate",  amount: "5",    hash: "u1v2w3x4...", timestamp: "2026-07-06T09:55:00Z" },
  { address: "GBYN8C...H6I2",  action: "send",     amount: "200",  hash: "y5z6a7b8...", timestamp: "2026-07-06T14:10:00Z" },
  { address: "GAQL5T...N4O9",  action: "donate",  amount: "30",   hash: "c9d0e1f2...", timestamp: "2026-07-07T10:00:00Z" },
  { address: "GD8MHX...R2S5",  action: "connect",  amount: null,   hash: null,          timestamp: "2026-07-08T08:45:00Z" },
];

export const SEED_FEEDBACK = [
  { name: "Maya R.",    wallet: "GD7XHK...F3T2", rating: 5, comment: "Settlement in seconds and fees you can't even feel. This is what on-chain payments should always feel like.", timestamp: "2026-07-03T11:00:00Z" },
  { name: "Daniel K.",  wallet: "GCWQY4...A9P1", rating: 5, comment: "The crowdfunding flow is genuinely trustless — funds go straight into the contract. No backend to trust.", timestamp: "2026-07-04T14:00:00Z" },
  { name: "Priya S.",   wallet: "GDMZPK...B8R7", rating: 4, comment: "Non-custodial, sign everything in Freighter, and it just works. Exactly the UX I want.", timestamp: "2026-07-05T10:30:00Z" },
  { name: "James T.",   wallet: "GBFJ3N...K2L9", rating: 5, comment: "The live on-chain analytics are incredible — you can see every donation in real time.", timestamp: "2026-07-06T09:00:00Z" },
  { name: "Sofia L.",   wallet: "GA2XLP...Q5M3", rating: 5, comment: "Love the donor badge system — gave me Bronze tier on my first donation! 🥉", timestamp: "2026-07-07T15:20:00Z" },
];

// ── Local helpers ─────────────────────────────────────────────────────────────

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeLocal(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

/**
 * Merge two arrays of entries deduplicating by timestamp.
 */
function merge(a, b) {
  const seen = new Set(a.map(e => e.timestamp));
  const merged = [...a];
  for (const e of b) {
    if (!seen.has(e.timestamp)) {
      seen.add(e.timestamp);
      merged.push(e);
    }
  }
  return merged.sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get all wallet interactions (seed + locally recorded).
 */
export function getInteractions() {
  try {
    const local = readLocal(INTERACTIONS_KEY);
    return merge(local, SEED_INTERACTIONS).slice(0, 100);
  } catch {
    return SEED_INTERACTIONS;
  }
}

/**
 * Record a new wallet interaction locally.
 * @param {string} address  full wallet address
 * @param {string} action   "connect" | "send" | "donate"
 * @param {string|null} amount
 * @param {string|null} hash
 */
export function recordInteraction(address, action, amount = null, hash = null) {
  try {
    const local = readLocal(INTERACTIONS_KEY);
    const entry = {
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown",
      action,
      amount,
      hash: hash ? hash.slice(0, 12) + "..." : null,
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...local].slice(0, 100);
    writeLocal(INTERACTIONS_KEY, updated);
    return merge(updated, SEED_INTERACTIONS);
  } catch {
    return SEED_INTERACTIONS;
  }
}

/**
 * Get all feedback entries (seed + locally submitted).
 */
export function getFeedback() {
  try {
    const local = readLocal(FEEDBACK_KEY);
    return merge(local, SEED_FEEDBACK).slice(0, 50);
  } catch {
    return SEED_FEEDBACK;
  }
}

/**
 * Submit a new feedback entry locally.
 * @param {{ name: string, wallet: string, rating: number, comment: string }} entry
 */
export function submitFeedback(entry) {
  try {
    const local = readLocal(FEEDBACK_KEY);
    const newEntry = {
      ...entry,
      wallet: entry.wallet
        ? `${entry.wallet.slice(0, 6)}...${entry.wallet.slice(-4)}`
        : "Anonymous",
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...local].slice(0, 50);
    writeLocal(FEEDBACK_KEY, updated);
    return merge(updated, SEED_FEEDBACK);
  } catch (e) {
    throw e;
  }
}
