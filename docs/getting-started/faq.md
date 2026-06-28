# FAQ — Frequently Asked Questions

---

## General

### What is StellarFund?
StellarFund is a Soroban smart contract deployed on the Stellar Testnet that manages an on-chain crowdfunding campaign. Donors send XLM into the contract; the `owner` can withdraw the collected balance once a goal is reached.

### What is StellarFlow?
StellarFlow is the React front-end dApp that pairs with the StellarFund contract. It connects to a user's Freighter wallet, reads their balance, and signs/submits real Stellar Testnet transactions — with no sign-up and no custody of private keys.

### Is this on Mainnet?
No. The current deployment targets **Stellar Testnet only**. All XLM used has no real monetary value.

### Where is the live app?
[https://stellar-connect-wallet-rr5q.vercel.app/](https://stellar-connect-wallet-rr5q.vercel.app/)

---

## Wallet & Freighter

### Do I need to create a new wallet?
No. You can import any existing Stellar keypair into Freighter using your 12/24-word recovery phrase.

### Does StellarFlow store my private key?
**Never.** StellarFlow is fully non-custodial. Your private key never leaves the Freighter extension. The dApp only receives a signed XDR blob after you approve it in Freighter.

### Why is the connect button not working?
Make sure:
- Freighter is installed and enabled in your browser.
- The app is served over HTTPS (`npm start` sets `HTTPS=true`).
- Freighter is set to **Testnet** (Settings → Network).

### Why does my balance show 0?
New Testnet accounts need funding. Visit [Friendbot](https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY) to receive 10,000 test XLM.

---

## Transactions

### What is a "stroop"?
A stroop is the smallest unit of XLM. 1 XLM = 10,000,000 (10^7) stroops. The `toStroops()` helper in `src/lib/stellar.js` handles this conversion.

### Why does a send transaction take a few seconds?
Stellar's Testnet consensus typically finalises in 3–5 seconds. After submission the dApp polls for the transaction status via the Soroban RPC.

### What happens if a transaction fails?
The dApp catches the error and maps it to a friendly error message via the `FundError` mapping. The balance is not deducted and the error is shown in the UI.

### How is transaction history saved?
Transaction records are persisted in `localStorage` in the browser. They survive page refreshes and wallet disconnects but are **browser-local** — they won't appear in a different browser or incognito window.

---

## Smart Contracts

### What language are the contracts written in?
Both `fund` and `badge` are written in **Rust** using the **Soroban SDK v26**.

### What is the campaign goal?
1,000 XLM (`10,000,000,000` stroops — 10^10, because the goal is stored in stroops).

### How do I withdraw funds?
Call `fund.withdraw()` from the `owner` address (the account that deployed the contract). This method is protected by `require_auth()`.

### What are the badge tiers?
| Tier | Min Cumulative Donation |
|---|---|
| 🥉 Bronze | 1 XLM |
| 🥈 Silver | 10 XLM |
| 🥇 Gold | 100 XLM |

---

## Development

### How do I run the tests?
```bash
# Frontend (Jest)
CI=true npm test

# Contracts (Rust)
cd contract && cargo test
```

### Can I contribute?
Yes! See the [Contributing Guide](../contributing/contributing-guide.md).

### Which version of Soroban SDK is used?
`soroban-sdk 26`, as specified in `contract/Cargo.toml`.
