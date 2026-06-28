# Manual Test Plan

This document defines the manual test procedures for verifying end-to-end functionality of StellarFlow on the Stellar Testnet.

---

## Prerequisites

- [ ] Freighter installed, configured for Testnet, and funded via Friendbot
- [ ] Dev server running at `https://localhost:3000` (or live at Vercel URL)
- [ ] `fund` contract deployed to Testnet and `REACT_APP_FUND_CONTRACT_ID` set

---

## Test Suite 1 — Wallet Connection

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| TC-1 | Connect wallet | Click "Connect" → approve in Freighter | Address shown, balance displayed in XLM |
| TC-2 | Disconnect | Click "Disconnect" or refresh | Landing page shown, balance cleared |
| TC-3 | Wrong network | Set Freighter to Mainnet, click Connect | Error: "Please switch to Testnet" |
| TC-4 | Extension not installed | Use a browser without Freighter | Error: "Freighter not detected" |
| TC-5 | Deny permission | Click Connect → reject in Freighter | Error: "Wallet access denied" |

---

## Test Suite 2 — Send XLM

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| TC-6 | Valid send | Enter valid G... address + amount, click Send, approve in Freighter | Green "Transaction confirmed" badge with hash |
| TC-7 | Invalid address | Enter "INVALID" in recipient field | Inline error: "Invalid Stellar address" |
| TC-8 | Zero amount | Enter 0 in amount field | Inline error: "Amount must be greater than 0" |
| TC-9 | Insufficient balance | Enter amount > balance | Inline error: "Insufficient balance" |
| TC-10 | Decline signing | Click Send, reject in Freighter popup | Error: "Transaction signing was cancelled" |
| TC-11 | Balance refresh | Complete a send | Balance decreases by sent amount |
| TC-12 | History recorded | Complete a send | New entry in Recent Activity panel |

---

## Test Suite 3 — Campaign / Crowdfund Panel

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| TC-13 | Campaign loads | Navigate to Campaign tab | Progress bar, donor count, and raised amount displayed |
| TC-14 | Donate XLM | Enter donation amount, click Donate, approve in Freighter | "Donation confirmed" success state |
| TC-15 | Badge awarded | Donate ≥ 1 XLM (first time) | Badge tier shown: Bronze |
| TC-16 | Silver tier | Donate cumulatively ≥ 10 XLM | Badge tier shown: Silver |
| TC-17 | Campaign closed | Raise the full 1,000 XLM goal | `is_closed = true`, donate button disabled |

---

## Test Suite 4 — Transaction History

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| TC-18 | History persists | Send XLM, refresh page, reconnect | Transaction still in Recent Activity |
| TC-19 | Clear history | Click "Clear History" | Activity panel is empty |
| TC-20 | Explorer link | Click "View ↗" on a tx entry | Opens Stellar Expert in new tab |

---

## Test Suite 5 — Responsive UI

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| TC-21 | Mobile layout | View at 375px width | Single column, no horizontal scroll |
| TC-22 | Tablet layout | View at 768px width | 2-column grid |
| TC-23 | WebGL hero | Load landing page | Light-rays animation visible |
| TC-24 | Mouse interaction | Move cursor over hero | Light rays track cursor movement |

---

## Sign-Off Checklist

Before any release:
- [ ] All 24 test cases pass
- [ ] No console errors in browser DevTools
- [ ] CI pipeline is green (GitHub Actions)
- [ ] Contract tests pass: `cargo test` (11/11)
- [ ] Frontend tests pass: `CI=true npm test` (9/9)
