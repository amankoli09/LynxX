# Wallet Integration — Error Handling

This document covers error handling specific to Freighter wallet interactions.

---

## Error Categories

| Category | Examples | Source |
|---|---|---|
| Extension not found | Freighter not installed | `isConnected()` returns false |
| Permission denied | User clicks "Reject" in popup | `setAllowed()` rejection |
| User declined signing | User clicks "Reject" in signing popup | `signTransaction()` rejection |
| Network mismatch | User is on Mainnet, app expects Testnet | `getNetwork()` returns wrong value |
| RPC error | Soroban RPC unreachable | Network/timeout error |
| Contract error | ZeroAmount, CampaignClosed | On-chain execution failure |

---

## Handling Each Error

### Extension Not Installed

```js
import { isConnected } from "@stellar/freighter-api";

const connected = await isConnected();
if (!connected) {
  return setError(
    'Freighter wallet not detected. ' +
    '<a href="https://www.freighter.app" target="_blank">Install Freighter →</a>'
  );
}
```

### Permission Denied

`setAllowed()` resolves even on rejection in older API versions. Check `requestAccess()` instead:

```js
const { address, error } = await requestAccess();
if (error) {
  setError("Wallet access denied. Please approve the connection in Freighter.");
  return;
}
```

### User Declined Signing

```js
try {
  const signedXdr = await signTransaction(xdr, { network: "TESTNET" });
} catch (e) {
  if (e.message?.toLowerCase().includes("declined") ||
      e.message?.toLowerCase().includes("rejected")) {
    setError("Transaction signing was cancelled.");
  } else {
    setError(`Signing error: ${e.message}`);
  }
  return;
}
```

### Network Mismatch

```js
import { getNetwork } from "@stellar/freighter-api";

const network = await getNetwork();
if (network !== "TESTNET") {
  setError(
    `Wrong network: ${network}. ` +
    "Please switch Freighter to Testnet (Settings → Network)."
  );
  return;
}
```

---

## Error UI Pattern

All wallet errors surface in the same error banner component in `Header.js`:

```jsx
{walletError && (
  <div className="error-banner" role="alert">
    <span className="error-icon">⚠</span>
    <span>{walletError}</span>
    <button onClick={() => setWalletError(null)}>✕</button>
  </div>
)}
```

---

## Error Recovery Flow

```
Error shown
    │
    ▼
User reads error message
    │
    ├─ Extension not installed → link to freighter.app
    ├─ Permission denied       → retry connect button
    ├─ Network mismatch        → instructions to switch network
    └─ Signing declined        → retry transaction button
```

---

## Related Docs

- [Frontend Error States →](../error-handling/frontend-error-states.md)
- [Contract Errors →](../error-handling/contract-errors.md)
- [Connect Flow →](./connect-flow.md)
