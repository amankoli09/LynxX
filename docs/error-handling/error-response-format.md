# Error Response Format

Standardised reference for error formats across Soroban RPC, Horizon, and the Freighter API.

---

## Soroban RPC Error Formats

### Simulation Error

When `simulateTransaction()` fails:

```json
{
  "error": "HostError: Error(Contract, #2)\nCall stack:\n  ...",
  "latestLedger": 12345
}
```

- `error` is a string containing the Soroban host error description.
- The contract error code appears as `#N` inside the `Error(Contract, ...)` segment.

**Parse pattern:**
```js
const match = simError.error.match(/Error\(Contract, #(\d+)\)/);
const code = match ? parseInt(match[1]) : null;
```

---

### Transaction Failed

When `getTransaction()` returns `FAILED`:

```json
{
  "status": "FAILED",
  "resultXdr": "AAAB...==",
  "resultMetaXdr": "AAAA...=="
}
```

Decode `resultXdr` using the Stellar SDK to inspect the specific error:

```js
import { xdr } from "@stellar/stellar-sdk";
const result = xdr.TransactionResult.fromXDR(resultXdr, "base64");
```

---

## Horizon API Error Format

Horizon returns RFC 7807 problem+json errors:

```json
{
  "type": "https://stellar.org/horizon-errors/transaction_failed",
  "title": "Transaction Failed",
  "status": 400,
  "detail": "The transaction failed when submitted to the stellar network.",
  "extras": {
    "envelope_xdr": "...",
    "result_codes": {
      "transaction": "tx_failed",
      "operations": ["op_underfunded"]
    }
  }
}
```

Common `result_codes.operations` values:

| Code | Meaning |
|---|---|
| `op_underfunded` | Insufficient XLM balance |
| `op_no_destination` | Recipient account doesn't exist |
| `op_low_reserve` | Would drop sender below minimum reserve |
| `op_bad_auth` | Auth failure |

---

## Freighter API Error Format

Freighter throws JavaScript `Error` objects:

```js
// User declined
{ message: "User declined access" }

// Extension not installed
{ message: "Freighter is not installed" }

// Signing declined
{ message: "User declined transaction signing" }
```

---

## Frontend Error Normalisation

All error types are normalised into a single `AppError` shape before display:

```js
function normaliseError(err) {
  // Contract error
  const contractCode = parseContractErrorCode(err);
  if (contractCode !== null) {
    return { type: "contract", code: contractCode, message: CONTRACT_ERRORS[contractCode] };
  }

  // Freighter error
  if (err?.message?.includes("declined")) {
    return { type: "user_cancelled", message: "Transaction cancelled by user." };
  }

  // Generic
  return { type: "unknown", message: err?.message ?? "An error occurred." };
}
```
