# DonorBadge Contract (`badge`)

The `badge` contract is the companion loyalty-tier contract. It is invoked by the `fund` contract via a cross-contract call every time a donation is made.

**Source:** [`contract/contracts/badge/src/lib.rs`](../../contract/contracts/badge/src/lib.rs)
**Network:** Stellar Testnet

---

## Purpose

The DonorBadge contract maintains a mapping of donor addresses to loyalty tiers based on their **cumulative donation total** tracked by the fund contract. Tiers are:

| Tier | Value | Min Cumulative Donation |
|---|---|---|
| 🥉 Bronze | `1` | > 0 XLM |
| 🥈 Silver | `2` | ≥ 10 XLM |
| 🥇 Gold | `3` | ≥ 100 XLM |

---

## Constructor

```rust
fn __constructor(env: Env, admin: Address)
```

`admin` is the **fund contract's address**. Only this address may call `award()`. Set at deploy time, stored in instance storage.

---

## Public Methods

### `award(env, donor, total)`

```rust
pub fn award(env: Env, donor: Address, total: i128)
```

| Arg | Type | Description |
|---|---|---|
| `donor` | `Address` | The donor's Stellar address |
| `total` | `i128` | The donor's cumulative donation total in stroops |

**Behaviour:**
1. Calls `admin.require_auth()` — ensures only the registered `fund` contract can call this.
2. Calculates the tier based on `total`:
   - `total >= 1_000_000_000` (100 XLM) → Gold (3)
   - `total >= 100_000_000` (10 XLM) → Silver (2)
   - otherwise → Bronze (1)
3. Writes the tier to persistent storage under `Tier(donor)`.

### `tier(env, donor) → u32`

```rust
pub fn tier(env: Env, donor: Address) -> u32
```

Returns the current badge tier for a given donor. Returns `0` if the donor has no badge.

### `admin(env) → Address`

Returns the registered admin address (the fund contract).

---

## Storage

| Key | Type | Storage Kind | Description |
|---|---|---|---|
| `Admin` | `Address` | Instance | The fund contract's address |
| `Tier(Address)` | `u32` | Persistent | Badge tier per donor |

---

## Security Model

The `award()` method uses `admin.require_auth()` where `admin` is the **fund contract's own address** (set at constructor time). This means:

- External users **cannot** call `award()` directly — they would fail the auth check.
- Only the fund contract, acting as a transaction authoriser, can mint badges.
- The badge update is **atomic** with the donation — both happen in the same Soroban transaction.

---

## Deployment Notes

After deploying the badge contract you must register it with the fund contract:

```bash
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --source-account $OWNER_KEYPAIR \
  --network testnet \
  -- set_badge \
  --badge $BADGE_CONTRACT_ID
```

See [Badge Wiring Setup](../deployment/badge-wiring-setup.md) for full deployment steps.

---

## Frontend Integration

The badge tier is read in the Crowdfund panel using the `tierName()` helper from `lib/stellar.js`:

```js
import { tierName } from '../lib/stellar';
// tierName(1) → "Bronze"
// tierName(2) → "Silver"
// tierName(3) → "Gold"
// tierName(0) → "None"
```
