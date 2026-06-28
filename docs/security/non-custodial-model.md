# Non-Custodial Model

StellarFlow is designed from the ground up as a non-custodial application. This document explains what that means and how it is enforced.

---

## What Non-Custodial Means

A **non-custodial** wallet application is one where:
- The user retains **full, exclusive control** of their private keys.
- The application **never has access** to private keys, seed phrases, or the ability to sign on behalf of the user without their explicit, real-time approval.
- There is **no server** that holds user funds or private keys.

StellarFlow satisfies all three requirements.

---

## How It's Enforced

### 1. Freighter Handles All Key Operations

All cryptographic operations (key storage, transaction signing) happen **inside the Freighter browser extension**. The extension's signing popup requires the user's active approval for every transaction.

```
dApp sends: unsigned XDR transaction
                   ↓
          Freighter extension
          (user sees details, approves)
                   ↓
dApp receives: signed XDR blob
```

The dApp never receives, stores, or transmits private keys.

### 2. No Backend

StellarFlow has **no server-side component**. It is a static React SPA deployed to Vercel. There is no:
- User account system
- Database
- API server
- Session management

All data flows directly between the browser and the Stellar network (Horizon API / Soroban RPC).

### 3. No Seed Phrase Input

The dApp never asks for a mnemonic phrase, private key, or any secret material. If a site claims to be StellarFlow and asks for your seed phrase, it is a phishing attack.

---

## Trust Model

```
User (private key in Freighter)
    │
    │ signs transactions
    ▼
Stellar Network (decentralised)
    │
    │ executes smart contracts
    ▼
StellarFund contract (open source, immutable on-chain)
```

The only entities the user must trust are:
1. The **Freighter extension** (open source: [github.com/stellar/freighter](https://github.com/stellar/freighter))
2. The **Stellar network** (decentralised, open source)
3. The **StellarFund contract** (source available at `contract/contracts/fund/src/lib.rs`)

---

## Verifying the Contract

Users can verify the deployed contract code on [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI) by comparing the on-chain WASM hash against the locally built artefact:

```bash
stellar contract info --id CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI --network testnet
```

---

## Related Docs

- [Key Management →](./key-management.md)
- [Auth — require_auth →](./auth-require_auth.md)
- [Threat Model →](./threat-model.md)
