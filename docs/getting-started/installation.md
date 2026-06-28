# Installation

This guide walks you through cloning and running the **StellarFlow** React dApp locally.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Node.js** | v16+ | [nodejs.org](https://nodejs.org) |
| **npm** | v8+ | Bundled with Node |
| **Git** | any | [git-scm.com](https://git-scm.com) |
| **Freighter** | latest | [freighter.app](https://www.freighter.app) |

> **Note:** Freighter is a browser extension (Chrome / Brave). You must install it separately — see [Freighter Setup](./freighter-setup.md).

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/amankoli09/Stellar-Connect-Wallet.git
cd Stellar-Connect-Wallet
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including:

- `@stellar/stellar-sdk` — Stellar & Soroban JS SDK
- `@stellar/freighter-api` — Freighter wallet API
- `ogl` — minimal WebGL renderer for the light-rays hero
- `react`, `react-dom` — React 18/19 runtime

---

## Step 3 — Start the Dev Server

```bash
npm start
```

The app runs over **HTTPS** at [https://localhost:3000](https://localhost:3000).

> **Why HTTPS?** Freighter requires a secure context (`https://`) to expose wallet APIs. The `cross-env HTTPS=true` flag in `package.json` enables this automatically.

You may see a browser warning about a self-signed certificate — click **Advanced → Proceed** to continue.

---

## Step 4 — Fund Your Testnet Wallet

Before you can send XLM or donate, your Freighter wallet needs Testnet tokens:

```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

Replace `YOUR_PUBLIC_KEY` with the `G...` address shown in Freighter after switching to Testnet.

Alternatively use [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).

---

## Running Tests

### Frontend (Jest)

```bash
CI=true npm test
```

Runs 9 unit tests in `src/lib/stellar.test.js` covering stroop conversion, address validation, and badge tier mapping.

### Contracts (Rust/Cargo)

```bash
cd contract
cargo test
```

Runs 11 tests — 6 for the `fund` contract and 5 for the `badge` contract.

---

## Building for Production

```bash
npm run build
```

Outputs an optimised bundle to `build/`. See [Frontend Deployment — Vercel](../deployment/frontend-deployment-vercel.md) for hosting instructions.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `HTTPS=true` certificate warning | Accept the self-signed cert in your browser |
| `npm install` fails | Ensure Node v16+ — run `node -v` |
| Freighter not detected | Install the extension and reload the page |
| Balance shows 0 | Fund your account via Friendbot (Step 4) |
