# Error Codes

Both contracts use Soroban's `#[contracterror]` macro to define strongly-typed error enums. These are returned as `Result::Err` and surface in the frontend as structured error objects.

---

## `fund` Contract Errors

```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum FundError {
    ZeroAmount     = 1,
    CampaignClosed = 2,
    NothingRaised  = 3,
}
```

| Code | Name | Method | Description |
|---|---|---|---|
| `1` | `ZeroAmount` | `donate()` | Called with `amount <= 0` stroops |
| `2` | `CampaignClosed` | `donate()` | The campaign goal has already been reached; no more donations accepted |
| `3` | `NothingRaised` | `withdraw()` | Owner called `withdraw()` when the contract holds zero balance |

---

## `badge` Contract Errors

The badge contract does not define custom errors for this version; invalid auth simply panics with a Soroban host error. Future versions may add:

| Code | Name | Method | Description |
|---|---|---|---|
| _(planned)_ `1` | `Unauthorised` | `award()` | Caller is not the registered admin |

---

## How Errors Surface in the Frontend

Soroban RPC returns errors as a structured `result_meta` field. `stellar-sdk` parses these into JavaScript objects. The `Fund.js` component maps them to user-facing messages:

```js
// Pseudocode from Fund.js
const errorMessages = {
  1: "Donation amount must be greater than zero.",
  2: "This campaign has already reached its goal.",
  3: "No funds have been raised yet.",
};

function handleContractError(err) {
  const code = parseContractErrorCode(err); // extract u32 from sdk error
  return errorMessages[code] ?? "An unexpected contract error occurred.";
}
```

---

## Soroban Host Errors vs. Contract Errors

| Type | Source | Example |
|---|---|---|
| **Contract Error** | `#[contracterror]` enum returned from the contract | `FundError::ZeroAmount` |
| **Host Error** | Soroban runtime (auth failure, out of budget, storage error) | `auth_required` panic |
| **SDK Error** | `stellar-sdk` network or parsing error | Invalid XDR, timeout |

The frontend should handle all three categories. Contract errors are the most actionable for users; host errors typically indicate a misconfigured transaction.

---

## Error Handling in Rust

Methods that can fail return `Result<T, FundError>`:

```rust
pub fn donate(env: Env, from: Address, amount: i128) -> Result<i128, FundError> {
    if amount <= 0 {
        return Err(FundError::ZeroAmount);
    }
    if env.storage().instance().get::<_, bool>(&DataKey::Closed).unwrap_or(false) {
        return Err(FundError::CampaignClosed);
    }
    // ... rest of logic
    Ok(new_raised)
}
```

See [Contract Errors](../error-handling/contract-errors.md) for frontend handling details.
