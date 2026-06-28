# Signing Transactions

All Stellar transactions must be signed by the authorising account's private key. In StellarFlow, this is done exclusively inside the **Freighter extension** — the dApp never handles private keys directly.

---

## How Transaction Signing Works

```
StellarFlow builds a transaction (XDR)
         │
         ▼
signTransaction(xdr, { network: "TESTNET" })
         │
         ▼
Freighter displays signing popup to user:
  - Transaction summary (from, to, amount)
  - Fee
  - Network
         │
  User approves ↓  or  User rejects → throws UserDeclinedError
         │
         ▼
Freighter signs with user's private key (never leaves extension)
         │
         ▼
Returns: signed XDR string
         │
         ▼
StellarFlow submits signed XDR to Soroban RPC
```

---

## Code Reference

```js
import { signTransaction } from "@stellar/freighter-api";
import { Transaction, Networks } from "@stellar/stellar-sdk";

async function signAndSubmit(unsignedTx) {
  // 1. Sign via Freighter
  const signedXdr = await signTransaction(
    unsignedTx.toXDR(),
    {
      network: "TESTNET",
      networkPassphrase: Networks.TESTNET,
    }
  );

  // 2. Reconstruct signed Transaction object
  const signedTx = Transaction.fromXDR(signedXdr, Networks.TESTNET);

  // 3. Submit to Soroban RPC
  const result = await server.sendTransaction(signedTx);
  return result;
}
```

---

## What Freighter Shows the User

When `signTransaction()` is called, Freighter opens a popup displaying:
- **Origin** — the dApp domain requesting the signature
- **Network** — Testnet or Mainnet
- **Operations** — a human-readable summary of each operation in the transaction
- **Fee** — the transaction fee in XLM
- **Approve / Reject** — user decision buttons

The user can inspect the full XDR by expanding "Advanced" in the Freighter popup.

---

## Soroban-Specific: Simulation Before Signing

Soroban transactions **must be simulated first** to populate auth entries and footprints before signing:

```js
// Step 1: Simulate
const simResult = await server.simulateTransaction(unsignedTx);
const preparedTx = SorobanRpc.assembleTransaction(unsignedTx, simResult);

// Step 2: Sign (the prepared tx includes auth entries from simulation)
const signedXdr = await signTransaction(preparedTx.toXDR(), { network: "TESTNET" });
```

Skipping simulation results in a Soroban host error on submission.

---

## Handling User Rejection

If the user clicks "Reject" in Freighter, `signTransaction()` throws an error. Handle it gracefully:

```js
try {
  const signedXdr = await signTransaction(xdr, { network: "TESTNET" });
  // proceed...
} catch (e) {
  if (e.message?.includes("User declined")) {
    setStatus("Transaction cancelled.");
  } else {
    setError(`Signing failed: ${e.message}`);
  }
}
```

---

## Related Docs

- [Connect Flow →](./connect-flow.md)
- [Send XLM Flow →](../transactions/send-xlm-flow.md)
- [RPC Configuration →](../stellar-specific/rpc-configuration.md)
