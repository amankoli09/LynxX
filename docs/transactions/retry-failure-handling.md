# Retry & Failure Handling

This document explains how StellarFlow handles failed transactions and provides retry mechanisms.

---

## Types of Failures

| Failure Type | When | Retry Strategy |
|---|---|---|
| **Validation error** | Before tx is built (bad address, zero amount) | Fix input, resubmit |
| **Simulation error** | Contract panics during simulation | Check contract state, fix args |
| **Signing declined** | User rejects in Freighter popup | User retries manually |
| **Submit error** | RPC returns `ERROR` status | Check error code, resubmit if transient |
| **Timeout** | `getTransaction()` times out after 20 polls | Resubmit (tx may not have been included) |
| **Network error** | RPC endpoint unreachable | Retry with exponential backoff |
| **Contract error** | `ZeroAmount`, `CampaignClosed`, `NothingRaised` | User-facing message, no retry needed |

---

## Retry for Transient Failures

```js
async function submitWithRetry(signedTx, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await server.sendTransaction(signedTx);

      if (result.status === "TRY_AGAIN_LATER") {
        await sleep(attempt * 2000); // exponential backoff
        continue;
      }

      return result;
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await sleep(attempt * 1000);
    }
  }
}
```

---

## `TRY_AGAIN_LATER` Handling

When the Soroban RPC returns `TRY_AGAIN_LATER`, the transaction was NOT submitted — the network is congested. The **same signed transaction** can be resubmitted:

```js
if (sendResult.status === "TRY_AGAIN_LATER") {
  setStatus("Network busy, retrying…");
  await sleep(3000);
  return await server.sendTransaction(signedTx); // resubmit same tx
}
```

---

## Timeout Handling

If `getTransaction()` returns `NOT_FOUND` after 20 attempts (40 seconds), the transaction is likely lost:

```js
async function waitForConfirmation(hash) {
  for (let i = 0; i < 20; i++) {
    const tx = await server.getTransaction(hash);
    if (tx.status !== "NOT_FOUND") return tx;
    await sleep(2000);
  }
  // Timeout — treat as unknown status
  throw new Error(
    `Transaction ${hash.slice(0, 8)}… not confirmed after 40s. ` +
    "Check the explorer and retry if needed."
  );
}
```

On timeout, the user is directed to check the transaction hash on Stellar Expert.

---

## UI Retry Button

After a recoverable error, the UI presents a retry button:

```jsx
{sendStatus === "error" && isRetryable && (
  <button className="btn-secondary" onClick={() => {
    setSendStatus("idle");
    setErrorMessage(null);
    // User can resubmit the form
  }}>
    ↺ Try Again
  </button>
)}
```

---

## Non-Retryable Errors

Some errors should not be retried automatically:
- `CampaignClosed` — the campaign is over; no retry makes sense.
- `ZeroAmount` — user must fix the input.
- User declined signing — user must act.

These show a clear error message without a retry button.
