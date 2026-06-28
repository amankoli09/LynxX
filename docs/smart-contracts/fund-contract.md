# StellarFund Contract (`fund`)

The `fund` contract is the core crowdfunding contract deployed on Stellar Testnet. It is written in **Rust** using the **Soroban SDK v26**.

**Source:** [`contract/contracts/fund/src/lib.rs`](../../contract/contracts/fund/src/lib.rs)
**Contract ID (Testnet):** `CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI`

---

## Constructor

```rust
fn __constructor(env: Env, owner: Address, token: Address, goal: i128)
```

Called **once** at deploy time. Sets:
- `owner` — the beneficiary who can call `withdraw()`
- `token` — the SAC address for the accepted asset (native XLM)
- `goal` — the fundraising target in stroops (e.g. `10_000_000_000` = 1,000 XLM)

---

## Public Methods

### `donate(env, from, amount) → i128`

```rust
pub fn donate(env: Env, from: Address, amount: i128) -> i128
```

| Arg | Type | Description |
|---|---|---|
| `from` | `Address` | Donor's Stellar address (must match auth entry) |
| `amount` | `i128` | Amount to donate in stroops |

**Behaviour:**
1. Calls `from.require_auth()` — the donor must sign the transaction.
2. Validates `amount > 0` — returns `ZeroAmount (1)` otherwise.
3. Validates campaign is open — returns `CampaignClosed (2)` if `is_closed`.
4. Calls `token::transfer(from, contract, amount)` via the SAC client.
5. Updates `raised` and per-donor `contribution(from)` in persistent storage.
6. Cross-calls `badge.award(from, donor_total)` if a badge contract is registered.
7. Sets `is_closed = true` if `raised >= goal`.
8. Emits `Donated { from, amount, total: raised }` event.
9. Returns the new `raised` total.

### `withdraw(env)`

```rust
pub fn withdraw(env: Env)
```

**Behaviour:**
1. Calls `owner.require_auth()` — only the owner may withdraw.
2. Validates `raised > 0` — returns `NothingRaised (3)` otherwise.
3. Transfers the full contract balance to `owner` via the SAC client.
4. Emits `Withdrawn { owner, amount }` event.

### `set_badge(env, badge)`

```rust
pub fn set_badge(env: Env, badge: Address)
```

Registers the badge contract's address so `donate()` can cross-call it. Only callable by the `owner`.

---

## Read-Only Methods

| Method | Returns | Description |
|---|---|---|
| `goal()` | `i128` | Campaign fundraising goal in stroops |
| `raised()` | `i128` | Total amount raised so far in stroops |
| `donors()` | `u32` | Number of unique donors |
| `is_closed()` | `bool` | `true` once the goal has been reached |
| `contribution(who: Address)` | `i128` | A given address's running total in stroops |
| `owner()` | `Address` | The campaign beneficiary address |
| `token()` | `Address` | The accepted SAC token address |

---

## Errors

| Code | Name | When |
|---|---|---|
| `1` | `ZeroAmount` | `donate()` called with `amount <= 0` |
| `2` | `CampaignClosed` | `donate()` called after goal was reached |
| `3` | `NothingRaised` | `withdraw()` called when `raised == 0` |

---

## Events

| Event | Fields | Emitted By |
|---|---|---|
| `Donated` | `from: Address, amount: i128, total: i128` | `donate()` |
| `Withdrawn` | `owner: Address, amount: i128` | `withdraw()` |

---

## Storage

| Key | Type | Storage Kind | Description |
|---|---|---|---|
| `Owner` | `Address` | Instance | Campaign beneficiary |
| `Token` | `Address` | Instance | SAC token address |
| `Goal` | `i128` | Instance | Fundraising target |
| `Raised` | `i128` | Instance | Total raised so far |
| `Donors` | `u32` | Instance | Unique donor count |
| `Closed` | `bool` | Instance | Campaign closed flag |
| `Badge` | `Address` | Instance | Optional badge contract ID |
| `Contrib(Address)` | `i128` | Persistent | Per-donor cumulative total |
