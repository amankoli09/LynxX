# System Overview

StellarFund + StellarFlow is a **three-layer architecture**: two Soroban smart contracts deployed on Stellar Testnet, a React single-page application in the browser, and a Freighter wallet extension that acts as the cryptographic signer.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (User)                                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  StellarFlow — React 18/19 (Create React App)            │   │
│  │                                                          │   │
│  │  Header.js   →  Landing page + Dashboard UI              │   │
│  │  Freighter.js →  Connect / Address / Balance / Sign      │   │
│  │  Fund.js      →  Soroban RPC client (read/donate/events) │   │
│  │  Crowdfund.js →  Campaign UI (loading / error states)    │   │
│  │  LightRays.js →  WebGL hero (OGL + GLSL)                │   │
│  │  lib/stellar.js → Pure helpers (unit-tested)             │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │                                                │
│  ┌──────────────▼──────────┐                                    │
│  │  Freighter Extension    │  (signs XDR inside browser)        │
│  └──────────────┬──────────┘                                    │
└─────────────────│───────────────────────────────────────────────┘
                  │  @stellar/stellar-sdk + @stellar/freighter-api
                  ▼
       ┌────────────────────┐
       │  Soroban RPC       │  https://soroban-testnet.stellar.org
       │  (Stellar Testnet) │
       └─────────┬──────────┘
                 │ simulate + submit
        ┌────────┴─────────┐
        ▼                   ▼
  ┌───────────┐     ┌──────────────┐
  │  fund     │─────│  badge       │
  │ contract  │award│  contract    │
  │ (Rust/    │────▶│  (Rust/      │
  │  Soroban) │     │   Soroban)   │
  └───────────┘     └──────────────┘
```

---

## Layer Responsibilities

### Layer 1 — Soroban Smart Contracts (on-chain)

| Contract | File | Responsibility |
|---|---|---|
| `fund` | `contract/contracts/fund/src/lib.rs` | Stores campaign state (raised, donors, goal); accepts `donate()` calls; calls `badge.award()` cross-contract; `withdraw()` to owner |
| `badge` | `contract/contracts/badge/src/lib.rs` | Assigns loyalty tier (Bronze/Silver/Gold) based on cumulative donation; only callable by the `fund` contract address |

### Layer 2 — StellarFlow React dApp

| File | Responsibility |
|---|---|
| `Header.js` | Landing hero, wallet connect button, dashboard grid |
| `Freighter.js` | Freighter API calls: `setAllowed`, `requestAccess`, `signTransaction`, balance fetch |
| `Fund.js` | Soroban RPC simulation and submission for `donate()`; reads `raised()`, `donors()`, `goal()`, `is_closed()`, events |
| `Crowdfund.js` | Campaign UI component with idle/pending/success/error state machine |
| `LightRays.js` | OGL-powered WebGL light-rays effect on the landing page |
| `lib/stellar.js` | Pure, dependency-free helpers: stroop↔XLM, address validation, tier naming, address shortening |

### Layer 3 — Freighter Extension

Acts as a cryptographic signer inside the browser. Receives an XDR-encoded transaction from the dApp, shows the user what they're signing, and returns a signed XDR blob. **Private keys never leave Freighter.**

---

## Data Flow Summary

1. User clicks **Connect** → `setAllowed()` + `requestAccess()` via Freighter API.
2. Wallet address returned → `lib/stellar.js` validates format → Horizon API fetches XLM balance.
3. User enters recipient + amount → `Fund.js` builds a Soroban transaction → simulates via Soroban RPC.
4. Simulated XDR sent to Freighter for signing → signed XDR returned.
5. Signed XDR submitted to Soroban RPC → network confirms → UI updates.
6. On donation: `fund` contract cross-calls `badge.award()` atomically in the same transaction.

---

## Related Docs

- [Frontend Architecture →](./frontend-architecture.md)
- [Data Flow →](./data-flow.md)
- [Tech Stack →](./tech-stack.md)
- [Design Decisions →](./design-decisions.md)
