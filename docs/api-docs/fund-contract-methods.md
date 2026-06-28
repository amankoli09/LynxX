# Fund Contract API Methods

Complete API reference for the `StellarFund` smart contract.

**Contract ID (Testnet):** `CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI`
**Source:** `contract/contracts/fund/src/lib.rs`

---

## Constructor

### `__constructor`

```
Parameters:
  owner  : Address  — Campaign beneficiary (can withdraw)
  token  : Address  — SAC token address (native XLM)
  goal   : i128     — Fundraising target in stroops

Called once at deployment. Cannot be called again.
```

---

## Write Methods

### `donate(from, amount) → Result<i128, FundError>`

Accepts a donation from `from`.

```
Parameters:
  from   : Address  — Donor address (must provide auth)
  amount : i128     — Donation amount in stroops (must be > 0)

Returns:
  Ok(i128)              — New cumulative `raised` total in stroops
  Err(ZeroAmount)       — amount ≤ 0
  Err(CampaignClosed)   — goal already reached

Effects:
  - Transfers `amount` from donor to contract via SAC
  - Updates raised, donors count, per-donor contribution
  - Cross-calls badge.award() if badge contract registered
  - Sets is_closed = true if raised >= goal
  - Emits Donated { from, amount, total } event

Auth: from.require_auth()
```

---

### `withdraw() → Result<(), FundError>`

Transfers the full contract balance to the owner.

```
Parameters: none

Returns:
  Ok(())                — Successful withdrawal
  Err(NothingRaised)    — No funds to withdraw

Effects:
  - Transfers full SAC balance to owner
  - Emits Withdrawn { owner, amount } event

Auth: owner.require_auth()
```

---

### `set_badge(badge)`

Registers the DonorBadge contract address.

```
Parameters:
  badge : Address  — DonorBadge contract ID

Returns: ()

Auth: owner.require_auth()
```

---

## Read Methods

### `goal() → i128`
Returns the campaign fundraising goal in stroops.

### `raised() → i128`
Returns the total amount raised in stroops.

### `donors() → u32`
Returns the number of unique donors.

### `is_closed() → bool`
Returns `true` if the campaign goal has been reached.

### `contribution(who: Address) → i128`
Returns the cumulative donation total for a specific address in stroops.

### `owner() → Address`
Returns the campaign beneficiary address.

### `token() → Address`
Returns the SAC token address.

---

## CLI Invocation Examples

```bash
# Read raised amount
stellar contract invoke --id $FUND_CONTRACT_ID --network testnet -- raised

# Read a donor's contribution
stellar contract invoke --id $FUND_CONTRACT_ID --network testnet -- contribution \
  --who GABC...WXYZ

# Donate 10 XLM
stellar contract invoke --id $FUND_CONTRACT_ID --source $DONOR_KEY --network testnet -- donate \
  --from GABC...WXYZ \
  --amount 100000000
```

---

## JavaScript SDK Usage

```js
import { Contract, nativeToScVal, Address } from "@stellar/stellar-sdk";

const contract = new Contract(FUND_CONTRACT_ID);

// Build donate operation
const op = contract.call(
  "donate",
  new Address(walletAddress).toScVal(),
  nativeToScVal(amountStroops, { type: "i128" })
);
```
