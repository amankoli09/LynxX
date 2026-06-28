# Auth — `require_auth()`

Soroban's `require_auth()` is the primary access-control mechanism used in both the `fund` and `badge` contracts.

---

## How `require_auth()` Works

`address.require_auth()` asserts that the Stellar account represented by `address` has authorised the current contract invocation. If the assertion fails, the contract panics and the transaction is reverted.

For a user-signed transaction:
- The transaction must include an `auth_entry` for the calling address.
- Freighter populates this auth entry automatically when building the transaction via `stellar-sdk` + `signTransaction()`.

For a contract calling another contract:
- A contract calling `self.require_auth()` or `own_address.require_auth()` is automatically satisfied by the Soroban runtime (no extra signature needed).

---

## Usage in `fund` Contract

### `donate()` — Donor Auth

```rust
pub fn donate(env: Env, from: Address, amount: i128) -> Result<i128, FundError> {
    from.require_auth(); // Donor must sign the transaction
    // ...
}
```

This ensures that only the actual owner of the `from` address can initiate a donation from it. A malicious actor cannot donate on someone else's behalf.

### `withdraw()` — Owner Auth

```rust
pub fn withdraw(env: Env) -> Result<(), FundError> {
    let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
    owner.require_auth(); // Only the registered owner can withdraw
    // ...
}
```

### `set_badge()` — Owner Auth

```rust
pub fn set_badge(env: Env, badge: Address) {
    let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
    owner.require_auth();
    // ...
}
```

---

## Usage in `badge` Contract

### `award()` — Admin (Fund Contract) Auth

```rust
pub fn award(env: Env, donor: Address, total: i128) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth(); // Only the fund contract can call this
}
```

When the `fund` contract calls `badge.award()` in a cross-contract call, `admin` is the fund contract's own address. Soroban automatically satisfies `require_auth()` for a contract's own address when that contract is the invoker — no external signature needed.

---

## Security Properties

| Property | Guarantee |
|---|---|
| Replay protection | Each `auth_entry` includes ledger bounds — it cannot be replayed on a different ledger |
| Multi-sig support | If `owner` is a multi-sig account, `require_auth()` works correctly with threshold/signers |
| Contract-to-contract | A contract invoking another contract satisfies auth for its own address automatically |
| No forgery | An attacker cannot fake `require_auth()` without the actual signing key |

---

## Related Docs

- [Non-Custodial Model →](./non-custodial-model.md)
- [Signing Transactions →](../wallet-integration/signing-transactions.md)
- [Cross-Contract Calls →](../smart-contracts/cross-contract-calls.md)
