# Storage Model

Both Soroban contracts use Stellar's three storage tiers. This document explains what each contract stores, where, and why.

---

## Soroban Storage Tiers

| Tier | Lifetime | Cost | Use Case |
|---|---|---|---|
| **Instance** | Lives as long as the contract instance | Low | Contract-wide config (owner, goal, flags) |
| **Persistent** | Survives ledger archival if rent is paid | Medium | Per-entity data (donor totals, badge tiers) |
| **Temporary** | Auto-deleted after TTL | Low | Short-lived values (not used in this project) |

---

## `fund` Contract Storage

### Instance Storage

All instance keys use the `DataKey` enum:

```rust
#[contracttype]
enum DataKey {
    Owner,
    Token,
    Goal,
    Raised,
    Donors,
    Closed,
    Badge,
}
```

| Key | Type | Set By | Description |
|---|---|---|---|
| `Owner` | `Address` | `__constructor` | Beneficiary who may call `withdraw()` |
| `Token` | `Address` | `__constructor` | SAC address of accepted token (native XLM) |
| `Goal` | `i128` | `__constructor` | Campaign fundraising target in stroops |
| `Raised` | `i128` | `donate()` | Cumulative amount raised (updates on each donation) |
| `Donors` | `u32` | `donate()` | Number of unique donors (increments on first donation from an address) |
| `Closed` | `bool` | `donate()` | Set to `true` once `Raised >= Goal` |
| `Badge` | `Address` | `set_badge()` | Optional badge contract ID for cross-contract calls |

### Persistent Storage

```rust
#[contracttype]
enum DataKey {
    Contrib(Address),
}
```

| Key | Type | Set By | Description |
|---|---|---|---|
| `Contrib(Address)` | `i128` | `donate()` | Cumulative donation for a specific donor address |

Persistent storage is keyed per donor address. A donor's first donation creates the entry; subsequent donations update it. This total is passed to `badge.award()` for tier calculation.

---

## `badge` Contract Storage

### Instance Storage

| Key | Type | Set By | Description |
|---|---|---|---|
| `Admin` | `Address` | `__constructor` | The fund contract's address (the only allowed caller of `award()`) |

### Persistent Storage

| Key | Type | Set By | Description |
|---|---|---|---|
| `Tier(Address)` | `u32` | `award()` | Badge tier (1=Bronze, 2=Silver, 3=Gold) for a donor address |

---

## Storage Access Patterns

### Read Paths (no auth required)

```
raised()        → instance().get(Raised)
donors()        → instance().get(Donors)
goal()          → instance().get(Goal)
is_closed()     → instance().get(Closed)
owner()         → instance().get(Owner)
token()         → instance().get(Token)
contribution(w) → persistent().get(Contrib(w))
badge.tier(d)   → persistent().get(Tier(d))
```

### Write Paths (auth gated)

```
donate()        → persistent().set(Contrib(from), new_total)
                  instance().set(Raised, new_raised)
                  instance().set(Donors, new_count)
                  instance().set(Closed, true)  // if goal hit
withdraw()      → clears Raised (via token transfer, no storage write)
set_badge()     → instance().set(Badge, badge_id)
award()         → persistent().set(Tier(donor), tier)
```

---

## Rent & Ledger Archival

Soroban charges **rent** for persistent and instance storage entries based on how long they occupy ledger state. For this Testnet deployment:
- Contract instance storage is renewed automatically by interactions with the contract.
- Per-donor `Contrib` entries in persistent storage need periodic TTL extension if the contract goes dormant.
- See [Soroban Basics](../stellar-specific/soroban-basics.md) for rent details.
