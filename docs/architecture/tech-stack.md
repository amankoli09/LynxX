# Tech Stack

A concise reference for every technology used across StellarFund + StellarFlow.

---

## Smart Contracts

| Technology | Version | Role |
|---|---|---|
| **Rust** | stable (2021 edition) | Contract implementation language |
| **Soroban SDK** | `26` (`soroban-sdk = "26"`) | Soroban contract macros, storage, auth, events |
| **wasm32-unknown-unknown** | Rust target | Compiles contracts to WebAssembly for Soroban |
| **Stellar CLI** | `stellar-cli` (latest) | Build, deploy, invoke contracts from terminal |
| **Cargo workspace** | `contract/Cargo.toml` | Manages both `fund` and `badge` crates together |

---

## Blockchain / Network

| Technology | Detail |
|---|---|
| **Stellar Network** | Proof-of-Agreement consensus, 3-5s finality |
| **Soroban** | Stellar's smart-contract platform (WebAssembly-based) |
| **Stellar Testnet** | Network used for all deployments in this project |
| **Soroban RPC** | `https://soroban-testnet.stellar.org` — JSON-RPC endpoint for simulate/submit |
| **Horizon API** | `https://horizon-testnet.stellar.org` — REST API for balances, account info |
| **Native XLM SAC** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |

---

## Frontend

| Technology | Version | Role |
|---|---|---|
| **React** | `^19.2.7` | UI component library |
| **Create React App** | `react-scripts 5.0.1` | Build toolchain / dev server |
| **JavaScript (ES2020+)** | — | Application logic |
| **Vanilla CSS** | — | Full design system in `App.css` |
| **ogl** | `^1.0.11` | Minimal WebGL renderer for light-rays hero |
| **three** | `^0.184.0` | Secondary 3D rendering (MagicRings) |

---

## Stellar SDK & Wallet

| Technology | Version | Role |
|---|---|---|
| **@stellar/stellar-sdk** | `^15.1.0` | Build transactions, interact with Soroban RPC, parse results |
| **@stellar/freighter-api** | `^6.0.1` | Connect wallet, retrieve address, sign transactions |

---

## Testing

| Technology | Version | Role |
|---|---|---|
| **Jest** | (via react-scripts) | Frontend unit test runner |
| **@testing-library/react** | `^16.3.2` | React component testing utilities |
| **@testing-library/jest-dom** | `^6.9.1` | Custom DOM matchers |
| **cargo test** | (Rust built-in) | Soroban contract unit tests |

---

## Persistence & Storage

| Technology | Role |
|---|---|
| **Soroban Instance Storage** | Stores campaign-level data (goal, owner, token, raised, donor count) |
| **Soroban Persistent Storage** | Stores per-donor contribution totals and badge tiers |
| **Browser localStorage** | Stores transaction history on the client side |

---

## CI/CD & Deployment

| Technology | Role |
|---|---|
| **GitHub Actions** | Automated CI — runs contract tests + frontend test/build on every push to `main` |
| **Vercel** | Frontend hosting with automatic deployments on push |
| **vercel.json** | Configures SPA routing (`rewrites` to `index.html`) |

---

## Developer Tools

| Tool | Purpose |
|---|---|
| `cross-env` | Cross-platform `HTTPS=true` env var in `npm start` |
| `stellar-cli` | Contract build, deploy, and invocation |
| Stellar Laboratory | Manual contract interaction and account funding |
| Stellar Expert | Testnet blockchain explorer |
