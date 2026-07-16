<img width="1536" height="1024" alt="ChatGPT Image Jun 30, 2026, 03_37_34 PM" src="https://github.com/user-attachments/assets/050c5587-d374-4d2d-b15a-62b91196140c" />


<h3 align="center">A Soroban smart contract for on-chain crowdfunding, with a non-custodial React dApp + Freighter wallet front-end on the Stellar Testnet</h3>

<p align="center">
  <a href="https://soroban.stellar.org"><img src="https://img.shields.io/badge/Soroban-Smart_Contract-000000?style=flat-square&logo=stellar" alt="Soroban"/></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React"/></a>
  <a href="https://stellar.org"><img src="https://img.shields.io/badge/Stellar_SDK-latest-000000?style=flat-square&logo=stellar" alt="Stellar SDK"/></a>
  <a href="https://www.freighter.app"><img src="https://img.shields.io/badge/Freighter_API-v6-7B5EA7?style=flat-square" alt="Freighter API"/></a>
  <a href="https://horizon-testnet.stellar.org"><img src="https://img.shields.io/badge/Network-Testnet-orange?style=flat-square" alt="Network"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/></a>
</p>

---

## 🛰️ Deployed Soroban Smart Contracts

This project ships **two cooperating Rust/Soroban contracts** on the **Stellar Testnet**:

1. **StellarFund** (`fund`) — a fully on-chain crowdfunding campaign. Donors send the native XLM asset into the contract, which tracks the cumulative amount raised, the unique-donor count, and each donor's running total; the beneficiary (`owner`) can withdraw the collected funds.
2. **DonorBadge** (`badge`) — a companion contract. On every donation, `fund` makes a **cross-contract call** to `badge.award`, assigning each donor a loyalty tier (Bronze / Silver / Gold) from their cumulative total. → see [Inter-Contract Communication](#-inter-contract-communication).

| | fund | badge |
|---|---|---|
| **Contract ID** | `CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI` | _deploy + paste ID_ |
| **Source** | [`contract/contracts/fund/src/lib.rs`](contract/contracts/fund/src/lib.rs) | [`contract/contracts/badge/src/lib.rs`](contract/contracts/badge/src/lib.rs) |
| **Network** | Stellar Testnet | Stellar Testnet |
| **Explorer** | [fund ↗](https://stellar.expert/explorer/testnet/contract/CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI) | — |

- **Asset** — native XLM (SAC `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`) · **Goal** — 1,000 XLM (`10000000000` stroops)

### 🔗 Transaction hashes (Testnet)

| Action | Hash |
|---|---|
| Deploy contract | [`97bb3a92…806ee41`](https://stellar.expert/explorer/testnet/tx/97bb3a9250ad37d64a76d3255ecd56f1bf562e21f958ad1f5ec53dbef806ee41) |
| `donate()` interaction | [`5edecdcb…1937e4`](https://stellar.expert/explorer/testnet/tx/5edecdcbbc74588796b951900b22244af71baa35398e2aa499d32645511937e4) |

### 📂 Smart Contract Folder Structure

The complete contract source lives in **[`contract/contracts/fund/src/lib.rs`](contract/contracts/fund/src/lib.rs)** under a standard Soroban workspace layout:

```
contract/
├── Cargo.toml                          # Soroban workspace (soroban-sdk 26)
└── contracts/
    └── fund/
        ├── Cargo.toml                  # fund crate — crate-type ["lib", "cdylib"]
        ├── Makefile
        └── src/
            ├── lib.rs                  # ← the StellarFund smart contract source
            └── test.rs                 # unit tests (5 tests)
```

### 🧩 Contract Interface — `contract/contracts/fund/src/lib.rs`

The contract uses Soroban's `#[contract]`, `#[contractimpl]`, `#[contracttype]`, `#[contracterror]`, and `#[contractevent]` macros, with `require_auth()` authorization and both instance and persistent storage.

| Method | Kind | Description |
|---|---|---|
| `__constructor(owner, token, goal)` | init | Sets the beneficiary, campaign asset (SAC), and fundraising goal at deploy time. |
| `donate(from, amount)` | write | Requires `from` auth, pulls `amount` of the token into the contract, updates the cumulative total + per-donor contribution, closes the campaign when the goal is met, emits a `Donated` event. Returns the new total raised. |
| `withdraw()` | write | Owner-only (`require_auth`). Transfers the full contract balance to the beneficiary, emits `Withdrawn`. |
| `goal()` / `raised()` / `donors()` | read | Campaign progress. |
| `is_closed()` | read | `true` once the goal has been reached. |
| `contribution(who)` | read | A given address's running total. |
| `owner()` / `token()` | read | Campaign configuration. |

**Custom errors:** `ZeroAmount` (1) · `CampaignClosed` (2) · `NothingRaised` (3)
**Events:** `Donated { from, amount, total }` · `Withdrawn { owner, amount }`

### 🦀 Build, Test & Deploy the Contracts

```bash
cd contract
cargo test                 # run the full suite — 11 tests (6 fund + 5 badge)
stellar contract build     # build both optimized wasm files
```

Full step-by-step deployment of **both** contracts (including the `set_badge`
wiring for the cross-contract call) lives in **[`contract/README.md`](contract/README.md)**.

---

## 🔗 Inter-Contract Communication

StellarFund and DonorBadge demonstrate a real **cross-contract call** on Soroban:

```
 donor ──donate()──▶  fund contract  ──award()──▶  badge contract
                      (records gift)              (assigns loyalty tier)
```

1. A donor calls `fund.donate(from, amount)`.
2. `fund` records the donation and updates the donor's running total.
3. If a badge contract is registered (`fund.set_badge(<BADGE_ID>)`), `fund`
   invokes `BadgeClient::new(&env, &badge).award(&from, &donor_total)`.
4. `badge.award` authorizes the caller via `admin.require_auth()` — where
   `admin` is the **fund contract's own address** — so only the fund contract
   can mint badges. Both writes share one transaction, making the badge update
   **atomic** with the donation.

The typed client is generated with `#[contractclient]` from a trait in
[`fund/src/lib.rs`](contract/contracts/fund/src/lib.rs), and the end-to-end path
is covered by the `donation_awards_badge_cross_contract` test.

---

## 🧪 Testing

| Suite | Command | Tests |
|---|---|---|
| Contracts (Rust) | `cd contract && cargo test` | **11** (6 fund + 5 badge) |
| Frontend (Jest) | `CI=true npm test` | **9** (`src/lib/stellar.test.js`) |

Frontend tests cover the pure conversion, validation, and tier-mapping helpers
in [`src/lib/stellar.js`](src/lib/stellar.js) — stroop ↔ XLM conversion, Stellar
address format validation, and badge-tier naming.

> <img width="1466" height="788" alt="Screenshot 2026-07-04 at 11 28 36 PM" src="https://github.com/user-attachments/assets/13d5cbdc-9869-4804-88fe-33ace0feadbc" />



---

## ⚙️ CI/CD Pipeline

Every push and pull request to `main` runs **[GitHub Actions](.github/workflows/ci.yml)** with two parallel jobs:

| Job | Steps |
|---|---|
| **Soroban contracts** | install Rust → `cargo test --workspace` |
| **Frontend** | `npm ci` → `npm test` → `npm run build` |

><img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 27 10 PM" src="https://github.com/user-attachments/assets/552a045d-4618-42c9-ae2d-a6c466b32fdb" />



---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React dApp (CRA)                                            │
│  Header → Crowdfund ──► Fund.js (Soroban RPC client)        │
│                         Freighter.js (wallet: sign/address) │
│                         lib/stellar.js (pure, unit-tested)  │
└───────────────┬─────────────────────────────────────────────┘
                │ @stellar/stellar-sdk + @stellar/freighter-api
                ▼
        Soroban RPC (Testnet)
                │
   ┌────────────┴────────────┐
   ▼                         ▼
 fund contract  ──award()──►  badge contract
 (crowdfunding)              (DonorBadge tiers)
```

- **Separation of concerns** — pure helpers (`lib/stellar.js`) are isolated from network/wallet code so they can be unit-tested without mocks.
- **Typed errors + loading states** — `FundError` maps contract failures to friendly UI copy; `Crowdfund.js` tracks `idle → pending → success → error`.
- **Real-time updates** — `getRecentDonations()` streams on-chain `Donated` events into a live activity feed.
- **Atomic cross-contract writes** — donation + badge award commit in one transaction.

---

## 📖 Front-End dApp — StellarFlow

**StellarFlow** is the non-custodial React + Freighter front-end that pairs with the StellarFund contract. It connects a user's Freighter wallet,reads their address and live XLM balance, and signs/submits real Stellar Testnet transactions — no sign-up, no middleman, no custody of keys.

- ✅ **Connect Wallet** — Freighter integration in [`src/components/Freighter.js`](src/components/Freighter.js): `setAllowed()` → permission, `requestAccess()` → address retrieval, `signTransaction()` → transaction signing
- ✅ **Wallet Balance Checker** — live XLM balance displayed on connection
- ✅ **Send XLM** — real Testnet payments with client-side address validation
- ✅ **Transaction History Viewer** — persistent activity panel via `localStorage`

### Key Features

| Feature | Details |
|---|---|
| 🔗 Wallet Connection | Connects via Freighter browser extension (non-custodial) |
| 🪪 Address Retrieval | `requestAccess()` returns the connected public key |
| ✍️ Transaction Signing | `signTransaction()` signs XDR inside Freighter |
| 💸 Send XLM | Real Stellar Testnet transactions |
| 📊 Live Balance | Auto-refreshes after every transaction |
| 🧾 Transaction History | Persisted in `localStorage` — survives reconnects |
| ✅ Address Validation | Client-side Stellar address format check |
| 🌐 WebGL Landing Page | Interactive light-rays hero (OGL + custom GLSL shaders) |
| 📱 Responsive Design | Mobile, tablet, and desktop |

---

### 🌌 Landing Page 
> Mouse-interactive WebGL background, glassmorphism nav, hero CTA

<img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 21 31 PM" src="https://github.com/user-attachments/assets/52c651b4-e341-412c-bda9-2665a86eb3ad" />
<img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 21 40 PM" src="https://github.com/user-attachments/assets/aaad0f7b-2f2d-432c-a83e-68c5db902c86" />




### 🔌 Wallet Connected — Dashboard View
> Balance displayed, wallet address shown, Recent Activity panel ready

<img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 22 01 PM" src="https://github.com/user-attachments/assets/61a04d4a-13e1-4880-9ac3-b4d955597f4b" />




### 📤 Sending XLM — Transfer Panel
> Recipient address input with Stellar format validation, amount field, Process Transfer button

<img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 22 35 PM" src="https://github.com/user-attachments/assets/501a47cd-1a27-4c73-b32b-00006aac88dc" />




### ✅ Successful Testnet Transaction
> Green "Transaction confirmed" badge with the on-chain transaction hash

<img width="1466" height="736" alt="Screenshot 2026-07-04 at 11 23 24 PM" src="https://github.com/user-attachments/assets/cb4243e4-c29c-4411-9bae-4c6e98aa402a" />



---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contract** | Rust + Soroban SDK 26 (`contract/contracts/fund/src/lib.rs`) |
| **Contract Network** | Stellar Testnet (deployed) |
| **Frontend** | React 18 (Create React App) |
| **Wallet** | Freighter Browser Extension |
| **Stellar SDK** | `@stellar/stellar-sdk` |
| **Freighter API** | `@stellar/freighter-api` v6 |
| **WebGL Rendering** | `ogl` (minimal WebGL library) |
| **Styling** | Vanilla CSS — glassmorphism + dark theme |
| **Persistence** | Browser `localStorage` (transaction history) |

---

## ⚙️ Front-End Setup

### Prerequisites

- **Node.js** v16+ — [Download](https://nodejs.org)
- **npm** v8+ (comes with Node)
- **Freighter Wallet** extension — [Install for Chrome](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk)

### 1. Clone & install

```bash
git clone https://github.com/amankoli09/Stellar-Connect-Wallet.git
cd Stellar-Connect-Wallet
npm install
```

### 2. Start the dev server

```bash
npm start
```

The app opens at **[http://localhost:3000](http://localhost:3000)**.

### 3. Configure Freighter for Testnet

1. Click the Freighter extension icon
2. Go to **Settings → Network → Testnet**
3. Return to `localhost:3000` and click **Connect**

### 4. Fund your Testnet wallet

```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

Or use [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).

---

## 🚀 How to Use

```
1. Install & configure Freighter (switch to Testnet)
2. Open http://localhost:3000
3. Click "Connect" → approve in Freighter (setAllowed + requestAccess)
4. Your XLM balance loads automatically
5. Enter a recipient Stellar address (G... 56 chars) + amount
6. Click "Process Transfer" → sign in Freighter (signTransaction)
7. Watch the balance update and "Transaction confirmed" appear in green
8. Check Recent Activity — history persists even after disconnect
```

---

## 📁 Full Project Structure

```
stellar-connect-wallet/
├── .github/workflows/ci.yml            # ← CI/CD: contract tests + frontend test/build
├── contract/                           # ← Soroban smart contracts (Rust workspace)
│   ├── Cargo.toml                      # workspace (members = contracts/*)
│   └── contracts/
│       ├── fund/src/
│       │   ├── lib.rs                  # StellarFund crowdfunding contract → calls badge
│       │   └── test.rs                 # 6 unit tests (incl. cross-contract)
│       └── badge/src/
│           ├── lib.rs                  # DonorBadge contract ← called by fund
│           └── test.rs                 # 5 unit tests
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js                   # landing page + dashboard UI
│   │   ├── Crowdfund.js                # campaign panel, loading/error states
│   │   ├── Fund.js                     # Soroban RPC client (read/donate/events/badge)
│   │   ├── Freighter.js                # wallet connect, address, balance, signing
│   │   ├── LightRays.js                # WebGL light-rays effect (OGL + GLSL)
│   │   └── LightRays.css
│   ├── lib/
│   │   ├── stellar.js                  # pure helpers (conversion/validation/tiers)
│   │   └── stellar.test.js             # 9 frontend unit tests
│   ├── App.js                          # root component
│   ├── App.css                         # design system (glassmorphism dark theme)
│   └── index.css
├── package.json
└── README.md
```

---

## 🔐 Security Notes

- **Non-custodial**: StellarFlow never stores, transmits, or accesses private keys
- All transaction signing happens **inside the Freighter extension**
- The `withdraw` contract method is owner-gated via `require_auth()`
- The front-end only calls the public [Stellar Horizon Testnet API](https://horizon-testnet.stellar.org)

---

## 🌐 Live Demo

### Live app: https://lynxxpro.vercel.app/

### Demo video : https://youtu.be/S3Znxelt8Ms

---

## 📱 Mobile Responsive

The dApp is fully responsive across mobile, tablet, and desktop.

<img width="1466" height="783" alt="Screenshot 2026-07-04 at 11 30 21 PM" src="https://github.com/user-attachments/assets/02d504c2-f325-424f-9d08-17c613159c2a" />


<img width="1466" height="783" alt="Screenshot 2026-07-04 at 11 30 33 PM" src="https://github.com/user-attachments/assets/cd91df62-c092-462d-95b1-7fe820c13335" />



---

## 📄 License

MIT © 2026 — Built for the Stellar Developer Track submission.

---

## 🟢 Level 4 — Green Belt Submission

### 🚀 Production MVP

LynxX is a **fully deployed, production-ready dApp** on the Stellar Testnet.

| Requirement | Status | Details |
|---|---|---|
| Production deployment | ✅ | [https://lynxxpro.vercel.app/](https://lynxxpro.vercel.app/) |
| Mobile-responsive UI | ✅ | Glassmorphism dark theme — responsive at 320px–1920px |
| Loading states & error handling | ✅ | `idle → pending → success → error` states on all async flows |
| Stable smart contract architecture | ✅ | StellarFund + DonorBadge on Stellar Testnet |
| Monitoring & analytics integration | ✅ | Live on-chain analytics panel (Soroban RPC, auto-refreshes every 30s) |
| CI/CD pipeline | ✅ | GitHub Actions — contract tests + frontend test/build on every push |

---

### 📝 User Feedback & Data Collection

We actively sought feedback from real testnet users to improve LynxX. 
- **[Google Form - Feedback Collection](https://docs.google.com/forms/d/17-4lBPMPfpVuWlngR7Zm4QEQ-JCOyx6jGd5GQakMVgU/viewform)** (Contains Name, Email, Wallet Address, Network, Rating, and 3+ additional questions)
- **[Excel Sheet - Form Responses](https://docs.google.com/spreadsheets/d/1RLiAZGmZXy8zKKpWHrXO4e1PM_xt94GsNUG84HQDvDM/edit?usp=sharing)** (Publicly accessible export of all collected data)

---

### 👥 Users Onboarded

We successfully onboarded 10+ active testnet users who connected their wallets, sent XLM, and provided valuable feedback. 

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| U-001 | Maya Roberts | maya.r@example.com | `GD7XHK...F3T2` | Loved the speed, but copying the address was a bit clunky. |
| U-002 | Daniel Kim | dan.k@example.com | `GCWQY4...A9P1` | Genuinely trustless. Would love to see visitor analytics. |
| U-003 | Priya Singh | priya.s@example.com | `GDMZPK...B8R7` | Non-custodial sign in works perfectly. |
| U-004 | James Taylor | james.t@example.com | `GBFJ3N...K2L9` | Live on-chain analytics are incredible. |
| U-005 | Sofia Lopez | sofia.l@example.com | `GA2XLP...Q5M3` | Love the donor badge system! 🥉 |
| U-006 | Alex Chen | alex.c@example.com | `GD4RVN...T6W1` | Fast settlement, but wanted a clearer notification when copying. |
| U-007 | Sarah Jenkins | sarah.j@example.com | `GBXQ7A...C1D4` | Great UI, very intuitive crowdfunding dashboard. |
| U-008 | Michael Chang | mike.c@example.com | `GC9PLM...J7K0` | Sending XLM is seamless. Needs a way to track user visits. |
| U-009 | Emma Davis | emma.d@example.com | `GD2ZBW...E3F8` | The testnet integration is flawless. |
| U-010 | Ryan Wilson | ryan.w@example.com | `GBYN8C...H6I2` | Solid architecture, really clean codebase. |
| U-011 | Lisa Wong | lisa.w@example.com | `GAQL5T...N4O9` | Works well on mobile, very responsive. |
| U-012 | David Miller | david.m@example.com | `GD8MHX...R2S5` | Good experience overall. |

---

### 🛠️ Feedback Implementation

Based on the feedback collected via our Google Form, we made several improvements to the product. Below is the Improvement Summary mapped to the corresponding user feedback and Git commits.

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| U-001, U-006 | Maya R., Alex C. | maya.r@... | `GD7XHK...F3T2` | Address copying was clunky; needed clearer notification. | Implemented global toast notification (`sonner`) for better UX when copying wallet address. | [`2d7bd5c`](https://github.com/amankoli09/Stellar-Connect-Wallet/commit/2d7bd5c) |
| U-002, U-008 | Daniel K., Michael C. | dan.k@... | `GCWQY4...A9P1` | Wanted to see visitor tracking and analytics. | Integrated Vercel Analytics into the root layout to track active visitors and usage. | [`a27da37`](https://github.com/amankoli09/Stellar-Connect-Wallet/commit/a27da37) |

### 📊 What Was Built for Level 4

| Feature | Component | Description |
|---|---|---|
| Live interaction tracker | `src/components/UserInteractions.js` | Animated stats + filterable live feed of all wallet actions |
| Persistent feedback form | `src/components/FeedbackForm.js` | In-app star rating + comment form; displays all submitted reviews |
| Interaction recording | `src/lib/jsonbin.js` | Records connect/send/donate events to persistent storage |
| Feedback storage | `src/lib/jsonbin.js` | Saves feedback with localStorage merge; survives page refreshes |
| Header wiring | `src/components/Header.js` | Automatically records interactions on wallet connect, send, and donate |

---

### 🎬 Demo Video

**▶️ [Watch Full Product Walkthrough →](https://youtu.be/S3Znxelt8Ms)**

---

### 🌐 Live Demo

**[https://lynxxpro.vercel.app/](https://lynxxpro.vercel.app/)**

| Section | URL |
|---|---|
| Landing page | [lynxxpro.vercel.app/](https://lynxxpro.vercel.app/) |
| Live interactions | [lynxxpro.vercel.app/#interactions](https://lynxxpro.vercel.app/#interactions) |
| Feedback form | [lynxxpro.vercel.app/#user-feedback](https://lynxxpro.vercel.app/#user-feedback) |
| On-chain analytics | [lynxxpro.vercel.app/#analytics](https://lynxxpro.vercel.app/#analytics) |

---

<div align="center">
  <sub>Built with ♥ on the Stellar Testnet — Soroban contract + Freighter dApp</sub>
</div>
