# Environment Setup

This page covers the environment variables and runtime configuration needed to run the project end-to-end.

---

## Frontend Environment Variables

The React app reads environment variables at build time via `process.env`. Variables **must** be prefixed with `REACT_APP_` to be accessible in browser code.

Create a `.env` file at the root of the project:

```bash
# .env  (git-ignored — never commit this file)

# Soroban RPC endpoint (Testnet)
REACT_APP_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Stellar Horizon API (Testnet)
REACT_APP_HORIZON_URL=https://horizon-testnet.stellar.org

# Network passphrase
REACT_APP_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Deployed fund contract ID
REACT_APP_FUND_CONTRACT_ID=CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI

# SAC token ID (native XLM)
REACT_APP_TOKEN_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

# (Optional) Deployed badge contract ID — fill after badge deploy
REACT_APP_BADGE_CONTRACT_ID=
```

> **Security:** `.env` files are included in `.gitignore`. Never commit secrets or private keys.

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SOROBAN_RPC_URL` | ✅ | Soroban JSON-RPC endpoint used by `stellar-sdk` to simulate & submit transactions |
| `REACT_APP_HORIZON_URL` | ✅ | Horizon REST API endpoint used to fetch account balances and transaction history |
| `REACT_APP_NETWORK_PASSPHRASE` | ✅ | Identifies which Stellar network transactions target (Testnet vs Mainnet) |
| `REACT_APP_FUND_CONTRACT_ID` | ✅ | On-chain address of the deployed `StellarFund` Soroban contract |
| `REACT_APP_TOKEN_ID` | ✅ | SAC address of the native XLM token that the contract accepts |
| `REACT_APP_BADGE_CONTRACT_ID` | ⬜ | Optional badge contract — wired in via `fund.set_badge()` after deployment |

---

## Testnet vs Mainnet Values

| Setting | Testnet | Mainnet |
|---|---|---|
| **Soroban RPC** | `https://soroban-testnet.stellar.org` | `https://soroban-mainnet.stellar.org` |
| **Horizon** | `https://horizon-testnet.stellar.org` | `https://horizon.stellar.org` |
| **Network Passphrase** | `Test SDF Network ; September 2015` | `Public Global Stellar Network ; September 2015` |

---

## Rust / Soroban Contract Environment

For building and deploying contracts you need:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install the Stellar CLI
cargo install --locked stellar-cli --features opt
```

Configure the Stellar CLI for Testnet:

```bash
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

---

## CI Environment Variables

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically injects the following secrets — set them in **Repository Settings → Secrets and variables → Actions**:

| Secret Name | Purpose |
|---|---|
| `REACT_APP_FUND_CONTRACT_ID` | Injected during `npm run build` in CI |
| `REACT_APP_SOROBAN_RPC_URL` | Injected for any integration tests |

See [GitHub Actions Overview](../ci-cd/github-actions-overview.md) for full pipeline details.
