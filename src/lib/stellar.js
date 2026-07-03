/* global BigInt */
// ════════════════════════════════════════════════════════════════
//  Pure Stellar/StellarFund helpers — no network, no wallet, no DOM.
//  Kept dependency-free so they are trivially unit-testable.
// ════════════════════════════════════════════════════════════════

// 1 XLM = 10^7 stroops.
export const STROOPS = 10_000_000;

/** Convert an XLM amount (string or number) to stroops as a BigInt. */
export function toStroops(xlm) {
    const n = parseFloat(xlm);
    if (!Number.isFinite(n)) return BigInt(0);
    return BigInt(Math.round(n * STROOPS));
}

/** Convert stroops (BigInt | number | string) back to XLM as a Number. */
export function fromStroops(stroops) {
    return Number(BigInt(stroops)) / STROOPS;

}

/**
 * Client-side format check for a Stellar public key: starts with `G`,
 * 56 chars, base32 alphabet (A–Z, 2–7). Not a checksum validation, but
 * enough to reject obvious typos before building a transaction.
 */
export function isValidStellarAddress(address) {
    return typeof address === "string" && /^G[A-Z2-7]{55}$/.test(address);
}

/** Human-readable name for a DonorBadge tier (mirrors the badge contract). */
export function tierName(tier) {
    switch (Number(tier)) {
        case 1:
            return "Bronze";
        case 2:
            return "Silver";
        case 3:
            return "Gold";
        default:
            return "None";
    }
}

/** Shorten an address for display, e.g. `GABC…WXYZ`. */
export function shortAddress(address) {
    return address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "";
}
