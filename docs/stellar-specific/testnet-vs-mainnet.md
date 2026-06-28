# Testnet vs Mainnet

This page explains the differences between Stellar Testnet and Mainnet and what changes are needed to move StellarFund to production.

---

## Key Differences

| Property | Testnet | Mainnet |
|---|---|---|
| **XLM Value** | No real value — free via Friendbot | Real monetary value |
| **Network Passphrase** | `Test SDF Network ; September 2015` | `Public Global Stellar Network ; September 2015` |
| **Soroban RPC** | `https://soroban-testnet.stellar.org` | `https://soroban-mainnet.stellar.org` |
| **Horizon API** | `https://horizon-testnet.stellar.org` | `https://horizon.stellar.org` |
| **Explorer** | [stellar.expert/testnet](https://stellar.expert/explorer/testnet) | [stellar.expert/public](https://stellar.expert/explorer/public) |
| **Reset frequency** | Periodically reset by SDF | Never reset |
| **Contract persistence** | May be cleared on reset | Permanent (with rent paid) |
| **Friendbot** | Available | Not available |

---

## Current Status

All StellarFund deployments are on **Testnet**. No Mainnet deployment exists.

---

## What Changes for Mainnet

### Environment Variables

Update `.env` (and Vercel environment variables):

```bash
REACT_APP_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
REACT_APP_HORIZON_URL=https://horizon.stellar.org
REACT_APP_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
REACT_APP_FUND_CONTRACT_ID=<new mainnet contract id>
REACT_APP_TOKEN_ID=<mainnet native XLM SAC id>
```

### Freighter Network

Users must have Freighter set to **Mainnet** (Public). The dApp should detect the active network via `getNetwork()` and warn users if they're on the wrong network.

### Contract Deployment

Contracts must be redeployed on Mainnet using a funded Mainnet keypair:

```bash
stellar network add --global mainnet \
  --rpc-url https://soroban-mainnet.stellar.org \
  --network-passphrase "Public Global Stellar Network ; September 2015"

stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/fund.wasm \
  --source-account $MAINNET_KEYPAIR \
  --network mainnet \
  -- --owner $OWNER_ADDRESS --token $XLM_SAC --goal 10000000000
```

### Security Audit Required

**Do not deploy to Mainnet without a security audit.** See [Audit Checklist](../security/audit-checklist.md).

---

## Detecting Network Mismatch

Add a network guard in `Freighter.js`:

```js
import { getNetwork } from "@stellar/freighter-api";

const network = await getNetwork();
if (network !== "TESTNET") {
  setError("Please switch Freighter to Testnet.");
}
```

---

## Testnet Reset Warning

Stellar Testnet is periodically reset by SDF. When this happens:
- All deployed contracts are wiped.
- All account balances are cleared.
- You must redeploy and re-fund.

Monitor the [Stellar Status Page](https://status.stellar.org) for reset announcements.
