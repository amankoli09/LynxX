# Cross-Contract Calls

StellarFund demonstrates a real cross-contract invocation on Soroban: the `fund` contract calls the `badge` contract atomically within the same donation transaction.

---

## Overview

```
 donor ──donate()──▶  fund contract  ──award()──▶  badge contract
                       (records gift)              (assigns loyalty tier)
```

1. A donor calls `fund.donate(from, amount)`.
2. `fund` records the donation and updates the donor's running total.
3. `fund` invokes `BadgeClient::new(&env, &badge_id).award(&from, &donor_total)`.
4. `badge.award()` authorises the caller via `admin.require_auth()` — where `admin` is **the fund contract's own address**.
5. The badge tier is written to persistent storage.
6. Both changes commit in a **single transaction** — the badge update is atomic with the donation.

---

## How the Typed Client Works

Soroban generates a typed client from the `#[contractclient]` macro placed on the badge's trait definition:

```rust
// In fund/src/lib.rs
#[contractclient(name = "BadgeClient")]
pub trait Badge {
    fn award(env: Env, donor: Address, total: i128);
}
```

This generates `BadgeClient<'a>` which provides a type-safe Rust interface to invoke the badge contract:

```rust
let badge_id: Address = env.storage().instance().get(&DataKey::Badge).unwrap();
BadgeClient::new(&env, &badge_id).award(&from, &donor_total);
```

The generated client serialises arguments to XDR, builds the `InvokeContractHost` instruction, and appends it to the current transaction's call stack automatically.

---

## Auth Requirements for Cross-Contract Calls

When `fund` calls `badge.award()`, the badge contract calls `admin.require_auth()` where `admin` is the **fund contract's own address**. This creates an auth chain:

```
Donor signs outer transaction (authorises fund.donate)
  └─ fund contract calls badge.award (as fund contract address)
       └─ badge calls admin.require_auth()
            └─ admin = fund contract address ✅ (auto-satisfied by Soroban)
```

Soroban automatically satisfies `require_auth()` for a contract's **own address** when that contract is the one making the call. External callers cannot forge this.

---

## Atomicity

Because the cross-contract call happens within the same Soroban host function execution:
- If `badge.award()` panics or reverts, the entire `donate()` transaction reverts.
- If `donate()` succeeds but `badge.award()` is not configured (no badge registered), the donation still succeeds — the badge call is conditional:

```rust
if let Some(badge_id) = env.storage().instance().get::<_, Address>(&DataKey::Badge) {
    BadgeClient::new(&env, &badge_id).award(&from, &donor_total);
}
```

---

## Testing the Cross-Contract Path

The `donation_awards_badge_cross_contract` test in `contract/contracts/fund/src/test.rs` deploys both contracts in the test environment and verifies the end-to-end path:

```rust
#[test]
fn donation_awards_badge_cross_contract() {
    // 1. Deploy fund + badge contracts
    // 2. Register badge in fund via set_badge()
    // 3. Call donate() with a donor address
    // 4. Read badge.tier(donor) and assert it equals Bronze (1)
}
```

Run with:
```bash
cd contract
cargo test donation_awards_badge
```
