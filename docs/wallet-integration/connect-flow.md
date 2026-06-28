# Connect Flow

This document describes the step-by-step process by which StellarFlow connects to the Freighter wallet.

---

## Flow Diagram

```
User clicks "Connect" button
         │
         ▼
isConnected() check — is Freighter installed?
         │ No → show "Install Freighter" message
         │ Yes ↓
         ▼
setAllowed() — request dApp permission
         │ User denies → show "Permission denied" error
         │ User approves ↓
         ▼
requestAccess() — retrieve public key
         │ Returns: G... 56-char Stellar address
         ▼
isValidStellarAddress(address) — validate format
         │ Invalid → show "Invalid address" error
         │ Valid ↓
         ▼
Horizon /accounts/{address} — fetch XLM balance
         │ Account not found → balance = "0"
         │ Found ↓
         ▼
setState({ walletAddress, balance, isConnected: true })
         │
         ▼
Dashboard renders with address + balance
```

---

## Code Reference (`Freighter.js`)

```js
import {
  isConnected,
  setAllowed,
  requestAccess,
} from "@stellar/freighter-api";

async function connectWallet() {
  // 1. Check extension is installed
  const connected = await isConnected();
  if (!connected) {
    setError("Freighter extension not found. Please install it.");
    return;
  }

  // 2. Request permission
  await setAllowed();

  // 3. Retrieve public key
  const { address } = await requestAccess();
  if (!isValidStellarAddress(address)) {
    setError("Received invalid Stellar address from Freighter.");
    return;
  }

  // 4. Fetch balance
  const balance = await fetchBalance(address);

  // 5. Update parent state
  onConnect({ address, balance });
}
```

---

## State Machine

| State | Description | Trigger |
|---|---|---|
| `disconnected` | No wallet connected | Initial load |
| `connecting` | `setAllowed()` / `requestAccess()` in progress | Click "Connect" |
| `connected` | Address and balance loaded | `requestAccess()` resolves |
| `error` | Permission denied or Freighter not found | Any step fails |

---

## Reconnection

Freighter stores the approved dApp origin. On a page reload the user does **not** need to re-approve — `requestAccess()` returns the address immediately without showing a popup.

StellarFlow does **not** auto-connect on page load (privacy best practice). The user must explicitly click "Connect" each session, but the approval step is skipped on subsequent visits.

---

## Disconnect

There is no programmatic `disconnect()` in the Freighter API. To "disconnect", StellarFlow:
1. Clears local state (`walletAddress = null`, `isConnected = false`).
2. The user can revoke access from Freighter Settings → Connected Sites.
