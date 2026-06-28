# Logging Strategy

StellarFlow uses lightweight, structured client-side logging. This page documents what is logged, where, and how to use logs for debugging.

---

## Logging Principles

1. **No server-side logging** — StellarFlow is a static SPA with no backend.
2. **Browser console** — all runtime logs go to `console.log` / `console.error`.
3. **No sensitive data** — private keys, seed phrases, and full transaction XDRs are never logged.
4. **Structured format** — logs include component name, action, and relevant data.

---

## Log Levels

| Level | Use Case | Method |
|---|---|---|
| `INFO` | Normal operations (wallet connected, tx submitted) | `console.log` |
| `WARN` | Recoverable issues (retry, unexpected state) | `console.warn` |
| `ERROR` | Non-recoverable errors (tx failed, auth error) | `console.error` |
| `DEBUG` | Verbose output for development only | `console.debug` |

---

## What is Logged

### Wallet Connect

```js
console.log("[Freighter] Connecting wallet...");
console.log("[Freighter] Connected:", shortAddress(address));
console.error("[Freighter] Connection failed:", err.message);
```

### Transaction Lifecycle

```js
console.log("[Fund] Building donate transaction:", { amount, from });
console.log("[Fund] Simulating transaction...");
console.log("[Fund] Submitting transaction:", { hash });
console.log("[Fund] Transaction confirmed:", { hash, status });
console.error("[Fund] Transaction failed:", { hash, error });
```

### Contract Reads

```js
console.log("[Fund] Campaign state:", { raised, donors, goal, isClosed });
```

---

## Development Debugging

To enable verbose logging, open browser DevTools Console (F12) and:
- Filter by `[Freighter]` to see wallet-related logs.
- Filter by `[Fund]` to see Soroban RPC-related logs.

---

## What is NOT Logged

| Data | Reason |
|---|---|
| Private keys | Never accessible to the dApp |
| Full XDR transactions | Too verbose; use Stellar Expert for inspection |
| Seed phrases | Never accessible |
| User balances | Avoid logging financial data unnecessarily |

---

## Production Logging (Future)

For production observability, consider integrating:
- **Sentry** — captures unhandled JavaScript errors with stack traces.
- **Posthog** — privacy-respecting analytics (wallet connected, tx submitted, errors).

These would supplement (not replace) the existing console-based logging.

---

## Related Docs

- [Event Streaming →](./event-streaming.md)
- [On-Chain Event Tracking →](./on-chain-event-tracking.md)
