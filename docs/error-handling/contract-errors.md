# Contract Errors

This page details all on-chain contract errors and how they are handled in the frontend.

---

## Error Definitions

### `fund` Contract (`FundError`)

| Code | Name | Trigger |
|---|---|---|
| `1` | `ZeroAmount` | `donate(from, amount)` called with `amount <= 0` |
| `2` | `CampaignClosed` | `donate()` called after the campaign reached its goal |
| `3` | `NothingRaised` | `withdraw()` called when the contract balance is 0 |

### `badge` Contract

No custom errors defined in the current version. Unauthorised calls to `award()` panic with a Soroban host auth error.

---

## How Errors Propagate

```
fund.donate() → returns Err(FundError::ZeroAmount)
      │
      ▼
Soroban RPC encodes error in transaction result_meta XDR
      │
      ▼
stellar-sdk parses → throws SorobanRpc.SimulateTransactionError
      │
      ▼
Fund.js catches → extracts error code
      │
      ▼
errorMessages[code] → user-facing string
      │
      ▼
Crowdfund.js renders error in UI
```

---

## Frontend Error Mapping

```js
// Fund.js
const CONTRACT_ERRORS = {
  1: "Donation amount must be greater than zero.",
  2: "This campaign has already reached its funding goal.",
  3: "There are no funds available to withdraw yet.",
};

function parseContractError(err) {
  // Extract the u32 error code from the SDK error object
  const match = err?.message?.match(/Error\(Contract, #(\d+)\)/);
  return match ? parseInt(match[1]) : null;
}

function getErrorMessage(err) {
  const code = parseContractError(err);
  return CONTRACT_ERRORS[code] ?? "An unexpected contract error occurred.";
}
```

---

## Host Errors vs. Contract Errors

| Type | Example | Handling |
|---|---|---|
| Contract error | `FundError::ZeroAmount` | Map code → friendly message |
| Host auth error | `auth_required` panic | Show "Authentication failed — check wallet" |
| Host resource error | Out of budget | Show "Transaction failed — try again" |
| SDK/network error | Timeout, invalid XDR | Show "Network error — check connection" |

---

## Related Docs

- [Error Codes →](../smart-contracts/error-codes.md)
- [Frontend Error States →](./frontend-error-states.md)
- [Retry & Failure Handling →](../transactions/retry-failure-handling.md)
