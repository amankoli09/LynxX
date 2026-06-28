# Send XLM Flow

This document walks through the complete flow for sending XLM from the StellarFlow dashboard.

---

## User-Facing Steps

```
1. Connect Freighter wallet (see Connect Flow)
2. Navigate to "Send XLM" panel
3. Enter recipient Stellar address (G... 56 chars)
4. Enter amount in XLM
5. Click "Process Transfer"
6. Review and approve in Freighter signing popup
7. See "Transaction confirmed" badge with hash
8. Balance auto-refreshes
9. Transaction appears in Recent Activity
```

---

## Technical Flow

```
User submits send form
        │
        ▼
Client-side validation:
  - isValidStellarAddress(recipient) → rejects invalid G... format
  - amount > 0
  - balance >= amount + fee
        │ invalid → show inline error
        │ valid ↓
        ▼
Load Stellar account (Horizon /accounts/{address})
        │  returns: sequence number, existing balances
        ▼
Build PaymentOperation:
  stellar-sdk TransactionBuilder
    .addOperation(Operation.payment({
      destination: recipient,
      asset: Asset.native(),
      amount: xlmAmount.toString(),
    }))
    .setTimeout(30)
    .build()
        │
        ▼
Soroban RPC → simulateTransaction(tx)
        │  returns: fee + footprint
        ▼
Freighter → signTransaction(preparedXdr, { network: "TESTNET" })
        │  user approves in popup
        ▼
Soroban RPC → sendTransaction(signedTx)
        │  returns: { hash, status: "PENDING" }
        ▼
Poll getTransaction(hash) until status ≠ NOT_FOUND
        │
        ├─ SUCCESS → update balance, append to localStorage, show success
        └─ FAILED  → show contract/host error message
```

---

## Building the Transaction

```js
import {
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
} from "@stellar/stellar-sdk";

const account = await horizonServer.loadAccount(walletAddress);

const tx = new TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(
    Operation.payment({
      destination: recipientAddress,
      asset: Asset.native(),
      amount: xlmAmount.toFixed(7),
    })
  )
  .setTimeout(30)
  .build();
```

---

## Loading States in the UI

| State | UI |
|---|---|
| `idle` | "Process Transfer" button enabled |
| `validating` | Inline field error messages |
| `pending` | Button shows spinner, "Submitting…" |
| `confirming` | "Confirming on Stellar…" message |
| `success` | Green badge with transaction hash link |
| `error` | Red error banner with retry option |

---

## Transaction History Entry

On success, a record is saved to `localStorage`:

```json
{
  "hash": "5edecdcb...",
  "to": "GABC...WXYZ",
  "amount": "10.0000000",
  "timestamp": 1720000000000,
  "status": "confirmed"
}
```

This powers the "Recent Activity" panel in the dashboard.

---

## Related Docs

- [Signing Transactions →](../wallet-integration/signing-transactions.md)
- [Transaction Status States →](./transaction-status-states.md)
- [Retry & Failure Handling →](./retry-failure-handling.md)
