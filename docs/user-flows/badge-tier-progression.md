# Badge Tier Progression

This document explains how donors progress through badge tiers in the DonorBadge loyalty system.

---

## Tier Overview

| Tier | Icon | Threshold | Description |
|---|---|---|---|
| None | — | 0 XLM | No donations yet |
| Bronze | 🥉 | Any amount | First donation (any size) |
| Silver | 🥈 | ≥ 10 XLM cumulative | Dedicated supporter |
| Gold | 🥇 | ≥ 100 XLM cumulative | Top-tier contributor |

---

## How Tiers Are Calculated

Tiers are based on **cumulative donation totals** — the sum of all donations from the same address across all transactions.

The fund contract tracks each donor's running total in `persistent` storage under `Contrib(address)`. On each donation, the new total is passed to `badge.award()`:

```rust
// In fund.donate()
let donor_total: i128 = env.storage().persistent()
    .get(&DataKey::Contrib(from.clone()))
    .unwrap_or(0)
    + amount;

env.storage().persistent().set(&DataKey::Contrib(from.clone()), &donor_total);

// Cross-call badge contract
BadgeClient::new(&env, &badge_id).award(&from, &donor_total);
```

```rust
// In badge.award()
let tier = if total >= 1_000_000_000 {  // 100 XLM
    3 // Gold
} else if total >= 100_000_000 {         // 10 XLM
    2 // Silver
} else {
    1 // Bronze
};
```

---

## Progression Examples

| Donation | Cumulative | Tier Assigned |
|---|---|---|
| 5 XLM | 5 XLM | 🥉 Bronze |
| 5 XLM | 10 XLM | 🥈 Silver |
| 90 XLM | 100 XLM | 🥇 Gold |

---

## Badge Tier in the UI

The current badge tier is displayed in the dashboard after connecting the wallet and making a donation. It uses the `tierName()` helper:

```js
import { tierName } from "../lib/stellar";

// tierName(1) → "Bronze"
// tierName(2) → "Silver"
// tierName(3) → "Gold"
// tierName(0) → "None"
```

---

## Tiers Are Monotonically Increasing

Tiers never go down. Each donation either:
- Keeps the current tier (if the cumulative total doesn't cross a threshold), or
- Upgrades to the next tier.

There is no mechanism to lose or reset a badge tier.

---

## Checking Your Tier

### Via the dApp
The dashboard Campaign panel displays your current badge tier after connecting your wallet.

### Via CLI

```bash
stellar contract invoke \
  --id $BADGE_CONTRACT_ID \
  --network testnet \
  -- tier \
  --donor YOUR_ADDRESS
```

Returns: `1` (Bronze), `2` (Silver), `3` (Gold), or `0` (None).

---

## Related Docs

- [Badge Contract →](../smart-contracts/badge-contract.md)
- [Cross-Contract Calls →](../smart-contracts/cross-contract-calls.md)
- [Donor Journey →](./donor-journey.md)
