# Overview

## What is StellarFund + StellarFlow?

**StellarFund + StellarFlow** is a fully on-chain crowdfunding dApp (decentralized application) built on the **Stellar blockchain** using **Soroban smart contracts** (written in Rust). The project ships two cooperating contracts alongside a non-custodial React front-end called **StellarFlow** that integrates the **Freighter** browser-extension wallet.

---

## Core Components

| Component | Description |
|---|---|
| **StellarFund** (`fund` contract) | On-chain crowdfunding campaign — tracks donations, donors, and campaign progress |
| **DonorBadge** (`badge` contract) | Companion contract — awards Bronze / Silver / Gold loyalty tiers on every donation |
| **StellarFlow** (React dApp) | Non-custodial front-end — connects Freighter wallet, reads balance, signs & submits real Stellar Testnet transactions |

---

## What Can Users Do?

1. **Connect Wallet** — Install the Freighter extension, approve the dApp, and instantly see your public key and live XLM balance.
2. **Send XLM** — Submit real Stellar Testnet payments with client-side address validation.
3. **Donate to a Campaign** — Call `fund.donate()` on the Soroban contract; your cumulative contribution is tracked on-chain.
4. **Earn a Badge** — Every donation triggers a cross-contract call to `badge.award()`, assigning you a Bronze, Silver, or Gold tier.
5. **View Transaction History** — A persistent activity panel (localStorage) lets you review every transaction even after reconnecting.

---

## Key Highlights

- **Non-custodial** — private keys never leave the Freighter extension.
- **Atomic cross-contract writes** — donation + badge tier assignment happen in one transaction.
- **Real-time updates** — on-chain `Donated` events stream into a live activity feed.
- **WebGL landing page** — an interactive light-rays hero built with OGL + custom GLSL shaders.
- **Deployed on Stellar Testnet** — live at [https://stellar-connect-wallet-rr5q.vercel.app/](https://stellar-connect-wallet-rr5q.vercel.app/)

---

## Deployed Contracts (Testnet)

| Contract | ID |
|---|---|
| `fund` | `CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI` |
| `badge` | _(deploy and paste your ID)_ |

---

## Next Steps

- [Installation →](./installation.md)
- [Environment Setup →](./environment-setup.md)
- [Freighter Setup →](./freighter-setup.md)
- [FAQ →](./faq.md)
