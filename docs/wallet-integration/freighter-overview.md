# Freighter Overview

Freighter is the official non-custodial wallet browser extension for the Stellar network. StellarFlow integrates Freighter via the `@stellar/freighter-api` npm package.

---

## What Freighter Provides

| Capability | API Method |
|---|---|
| Request dApp permission | `setAllowed()` |
| Get connected public key | `requestAccess()` / `getPublicKey()` |
| Sign a transaction (XDR) | `signTransaction(xdr, opts)` |
| Sign arbitrary blobs | `signBlob(blob, opts)` |
| Get connected network | `getNetwork()` |
| Check if extension installed | `isConnected()` |

---

## Why Freighter?

- **Stellar-native** — designed for the Stellar ecosystem, supports Soroban transactions natively.
- **Non-custodial** — private keys are stored encrypted in the browser extension, never sent to any server.
- **XDR signing** — understands Stellar's XDR transaction format and displays a human-readable summary before signing.
- **Multi-network** — supports Testnet, Mainnet, and custom Stellar networks.

---

## Integration Architecture

```
StellarFlow (React)
    │
    │ @stellar/freighter-api
    ▼
Freighter Extension (background page)
    │
    │ Encrypted keypair storage
    ▼
User sees signing popup → approves → signed XDR returned
    │
    ▼
StellarFlow submits signed XDR to Soroban RPC
```

---

## Permission Model

Freighter uses an **allowlist** model:
1. On first visit, `setAllowed()` prompts the user to approve the dApp origin.
2. Once approved, subsequent calls to `requestAccess()` and `signTransaction()` do not require re-approval unless the origin changes.
3. Users can revoke access at any time in Freighter's Settings → Connected Sites.

---

## Network Configuration in Code

`signTransaction()` accepts a `network` option to specify which network the transaction targets:

```js
import { signTransaction } from "@stellar/freighter-api";

const signedXdr = await signTransaction(unsignedXdr, {
  network: "TESTNET", // or "PUBLIC" for Mainnet
  networkPassphrase: "Test SDF Network ; September 2015",
});
```

If the user's Freighter is on a different network, they'll see a warning in the signing popup.

---

## Related Docs

- [Connect Flow →](./connect-flow.md)
- [Signing Transactions →](./signing-transactions.md)
- [Balance Fetching →](./balance-fetching.md)
- [Error Handling →](./error-handling.md)
