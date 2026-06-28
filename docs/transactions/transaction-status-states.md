# Transaction Status States

Every transaction in StellarFlow progresses through a defined set of states, both in the Stellar network and in the UI.

---

## Network-Level Status

When a transaction is submitted to the Soroban RPC via `sendTransaction()`, it moves through these network statuses:

| Status | Meaning |
|---|---|
| `PENDING` | Transaction received, not yet included in a ledger |
| `DUPLICATE` | Transaction was already submitted (same hash) |
| `TRY_AGAIN_LATER` | Network is busy — retry with the same transaction |
| `ERROR` | Transaction was rejected at the protocol level |

After the transaction is included in a ledger, `getTransaction(hash)` returns:

| Status | Meaning |
|---|---|
| `NOT_FOUND` | Not yet included — keep polling |
| `SUCCESS` | Transaction executed successfully |
| `FAILED` | Transaction included but execution reverted |

---

## UI State Machine

StellarFlow maps network states to UI states in `Header.js` and `Crowdfund.js`:

```
idle
  │ user submits form
  ▼
pending (spinner, button disabled)
  │ building + simulating tx
  ▼
confirming (waiting for ledger inclusion)
  │ polling getTransaction()
  ├─ SUCCESS ──▶ success (green badge, balance refresh)
  └─ FAILED  ──▶ error (red banner, error message)

error
  │ user clicks retry
  ▼
idle
```

---

## CSS State Classes

```css
.tx-status-pending   { color: var(--color-accent); }
.tx-status-success   { color: var(--color-success); animation: pulse 1s ease; }
.tx-status-error     { color: var(--color-error); }
.tx-status-idle      { color: var(--color-muted); }
```

---

## Polling Implementation

```js
async function waitForConfirmation(hash, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await server.getTransaction(hash);

    if (result.status !== SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
      return result;
    }

    await sleep(2000); // wait 2s between polls
  }
  throw new Error("Transaction confirmation timeout.");
}
```

---

## Status Display

```jsx
{sendStatus === "pending" && (
  <div className="tx-status tx-status-pending">
    <Spinner /> Processing transaction…
  </div>
)}

{sendStatus === "success" && (
  <div className="tx-status tx-status-success">
    ✅ Transaction confirmed!
    <a href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
       target="_blank" rel="noopener noreferrer">
      View on Explorer ↗
    </a>
  </div>
)}

{sendStatus === "error" && (
  <div className="tx-status tx-status-error">
    ⚠ {errorMessage}
    <button onClick={handleRetry}>Retry</button>
  </div>
)}
```

---

## Related Docs

- [Send XLM Flow →](./send-xlm-flow.md)
- [Retry & Failure Handling →](./retry-failure-handling.md)
- [RPC Configuration →](../stellar-specific/rpc-configuration.md)
