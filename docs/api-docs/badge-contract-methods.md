# Badge Contract API Methods

Complete API reference for the `DonorBadge` companion smart contract.

**Source:** `contract/contracts/badge/src/lib.rs`

---

## Constructor

### `__constructor`

```
Parameters:
  admin : Address  — The fund contract's address (the only allowed caller of award())

Called once at deployment.
```

---

## Write Methods

### `award(donor, total)`

Assigns or updates the badge tier for a donor based on their cumulative donation total.

```
Parameters:
  donor : Address  — The donor's Stellar address
  total : i128     — Donor's cumulative donation total in stroops (from fund contract)

Returns: ()

Effects:
  - Calculates tier from total:
      total >= 1,000,000,000 (100 XLM) → Gold   (3)
      total >=   100,000,000  (10 XLM) → Silver  (2)
      total >             0            → Bronze  (1)
  - Writes tier to persistent storage: Tier(donor)

Auth: admin.require_auth()  [admin = fund contract address]

Note: This method can only be called by the registered fund contract.
      External callers will fail the auth check.
```

---

## Read Methods

### `tier(donor: Address) → u32`

Returns the current badge tier for a donor.

```
Returns:
  0 — No badge (donor has not donated yet)
  1 — Bronze
  2 — Silver
  3 — Gold
```

### `admin() → Address`

Returns the registered admin address (the fund contract's address).

---

## Tier Calculation Reference

| Tier | Value | Minimum Stroops | Minimum XLM |
|---|---|---|---|
| Bronze | 1 | > 0 | Any amount |
| Silver | 2 | ≥ 100,000,000 | ≥ 10 XLM |
| Gold | 3 | ≥ 1,000,000,000 | ≥ 100 XLM |

---

## CLI Invocation Examples

```bash
# Read a donor's tier
stellar contract invoke --id $BADGE_CONTRACT_ID --network testnet -- tier \
  --donor GABC...WXYZ

# Read admin address
stellar contract invoke --id $BADGE_CONTRACT_ID --network testnet -- admin
```

---

## Frontend Usage

```js
import { tierName } from "../lib/stellar";

// Read tier from badge contract
const tier = await badgeContract.call("tier", addressScVal);
const tierNumber = scValToNative(tier); // → 1, 2, or 3
const displayTier = tierName(tierNumber); // → "Bronze", "Silver", or "Gold"
```
