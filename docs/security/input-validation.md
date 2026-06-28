# Input Validation

StellarFlow validates all user inputs before building transactions, preventing both user errors and potential attack vectors.

---

## Validation Layers

| Layer | Where | Method |
|---|---|---|
| **Client-side format** | React forms | `lib/stellar.js` helpers + inline checks |
| **Pre-simulation** | Before RPC call | Amount ≥ 1 stroop check |
| **On-chain** | Soroban execution | `require_auth()`, `ZeroAmount` error |

---

## Validated Fields

### Recipient Stellar Address

```js
// Format: G + 55 base-32 chars
if (!isValidStellarAddress(recipient)) {
  setError("Invalid Stellar address format.");
  return;
}

// Prevent self-send
if (recipient === walletAddress) {
  setError("Cannot send XLM to your own address.");
  return;
}
```

### XLM Amount

```js
const amountFloat = parseFloat(amount);

if (isNaN(amountFloat) || amountFloat <= 0) {
  setError("Amount must be greater than 0.");
  return;
}

const amountStroops = toStroops(amountFloat);

if (amountStroops <= BigInt(0)) {
  setError("Amount is too small (minimum 0.0000001 XLM).");
  return;
}
```

### Balance Check

```js
const balanceStroops = toStroops(parseFloat(balance));
const FEE_BUFFER = BigInt(10_000); // ~0.001 XLM for fees

if (amountStroops + FEE_BUFFER > balanceStroops) {
  setError("Insufficient balance (including estimated fees).");
  return;
}
```

---

## Contract-Side Validation

Even if the frontend validation is bypassed (e.g., direct CLI call), the contract enforces:

```rust
if amount <= 0 {
    return Err(FundError::ZeroAmount);
}
if env.storage().instance().get(&DataKey::Closed).unwrap_or(false) {
    return Err(FundError::CampaignClosed);
}
from.require_auth(); // panics if not authorised
```

---

## XSS Prevention

React escapes all string values rendered in JSX by default. No `dangerouslySetInnerHTML` is used in StellarFlow. All user-supplied values (recipient address, amount) are:
- Validated as numbers or Stellar addresses before use
- Displayed via React JSX (auto-escaped)
- Never injected into HTML strings or `eval()`

---

## Related Docs

- [Address Validation →](../wallet-integration/address-validation.md)
- [Frontend Helper Functions →](../api-docs/frontend-helper-functions.md)
- [Threat Model →](./threat-model.md)
