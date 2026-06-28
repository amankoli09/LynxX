# Environment Variables

Reference for all environment variables used across the StellarFund + StellarFlow project.

---

## Frontend (React)

All frontend variables must be prefixed with `REACT_APP_` to be accessible in browser code via `process.env.REACT_APP_*`.

### `.env` File (development)

```bash
# .env  — NOT committed to git
REACT_APP_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
REACT_APP_HORIZON_URL=https://horizon-testnet.stellar.org
REACT_APP_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
REACT_APP_FUND_CONTRACT_ID=CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI
REACT_APP_TOKEN_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
REACT_APP_BADGE_CONTRACT_ID=
```

### Variable Reference

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SOROBAN_RPC_URL` | ✅ | Soroban JSON-RPC for simulation and submission |
| `REACT_APP_HORIZON_URL` | ✅ | Horizon REST API for balance and history |
| `REACT_APP_NETWORK_PASSPHRASE` | ✅ | Stellar network identifier |
| `REACT_APP_FUND_CONTRACT_ID` | ✅ | Deployed `fund` contract Stellar address |
| `REACT_APP_TOKEN_ID` | ✅ | SAC address for native XLM |
| `REACT_APP_BADGE_CONTRACT_ID` | ⬜ | Optional `badge` contract address |

---

## CI/CD (GitHub Actions)

Set in **GitHub → Repository → Settings → Secrets and variables → Actions → Repository secrets**:

| Secret | Purpose |
|---|---|
| `REACT_APP_FUND_CONTRACT_ID` | Injected at `npm run build` time in CI |
| `REACT_APP_SOROBAN_RPC_URL` | Injected for build/integration tests |

> These are the same values as your `.env` file — the CI secrets mirror the environment.

---

## Vercel (Production)

Set in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Environment |
|---|---|
| `REACT_APP_SOROBAN_RPC_URL` | Production |
| `REACT_APP_HORIZON_URL` | Production |
| `REACT_APP_NETWORK_PASSPHRASE` | Production |
| `REACT_APP_FUND_CONTRACT_ID` | Production |
| `REACT_APP_TOKEN_ID` | Production |

---

## Security Rules

1. **Never commit `.env`** — it's in `.gitignore`.
2. **Never put private keys in environment variables** — use Stellar CLI keychain or hardware wallets.
3. **Rotate** any secret that is accidentally committed to git immediately.
4. **Use separate values** for Testnet vs Mainnet environments.

---

## Checking Variable Access in Code

```js
// In any React component or utility
const rpcUrl = process.env.REACT_APP_SOROBAN_RPC_URL;
const contractId = process.env.REACT_APP_FUND_CONTRACT_ID;

if (!contractId) {
  console.error("REACT_APP_FUND_CONTRACT_ID is not set.");
}
```
