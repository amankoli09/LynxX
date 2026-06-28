# Contract Tests

The Soroban smart contracts include a comprehensive suite of Rust unit tests using Soroban's built-in test environment.

---

## Running Tests

```bash
cd contract
cargo test
```

Expected output:
```
running 11 tests
test fund::test::test_donate_zero_amount ... ok
test fund::test::test_donate_success ... ok
test fund::test::test_campaign_closes_at_goal ... ok
test fund::test::test_withdraw_success ... ok
test fund::test::test_withdraw_nothing_raised ... ok
test fund::test::donation_awards_badge_cross_contract ... ok
test badge::test::test_award_bronze ... ok
test badge::test::test_award_silver ... ok
test badge::test::test_award_gold ... ok
test badge::test::test_award_unauthorized ... ok
test badge::test::test_tier_query ... ok

test result: ok. 11 passed; 0 failed
```

---

## Test Files

| File | Tests | Contract |
|---|---|---|
| `contract/contracts/fund/src/test.rs` | 6 | `fund` |
| `contract/contracts/badge/src/test.rs` | 5 | `badge` |

---

## Fund Contract Tests (`test.rs`)

### `test_donate_zero_amount`
Verifies that calling `donate()` with `amount = 0` returns `FundError::ZeroAmount`.

### `test_donate_success`
Verifies that a valid donation:
- Transfers tokens from donor to contract
- Increments `raised` by the donated amount
- Increments `donors` counter (first-time donor)
- Returns the new `raised` total

### `test_campaign_closes_at_goal`
Donates the exact campaign goal amount and verifies `is_closed()` returns `true` and subsequent donations return `FundError::CampaignClosed`.

### `test_withdraw_success`
After a donation, calls `withdraw()` as the owner and verifies the full balance is transferred to the owner address.

### `test_withdraw_nothing_raised`
Calls `withdraw()` before any donation and verifies `FundError::NothingRaised`.

### `donation_awards_badge_cross_contract`
Deploys both `fund` and `badge` contracts, registers the badge via `set_badge()`, makes a donation, and asserts that the donor's badge tier is `1` (Bronze).

---

## Badge Contract Tests (`test.rs`)

### `test_award_bronze`
Awards a small donation total and verifies tier = 1 (Bronze).

### `test_award_silver`
Awards ≥ 10 XLM and verifies tier = 2 (Silver).

### `test_award_gold`
Awards ≥ 100 XLM and verifies tier = 3 (Gold).

### `test_award_unauthorized`
Calls `award()` from a non-admin address and verifies the call panics with an auth error.

### `test_tier_query`
Awards a tier and verifies `tier(donor)` returns the correct value.

---

## Soroban Test Environment

Tests use the `soroban-sdk::testutils` mock environment:

```rust
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_donate_success() {
    let env = Env::default();
    env.mock_all_auths();

    let owner = Address::generate(&env);
    let donor = Address::generate(&env);
    let token = create_token_contract(&env, &owner);

    let contract_id = env.register(FundContract, (&owner, &token.address, &1000i128));
    let client = FundContractClient::new(&env, &contract_id);

    token.mint(&donor, &500);
    let raised = client.donate(&donor, &500);
    assert_eq!(raised, 500);
}
```

---

## Running a Single Test

```bash
cd contract
cargo test test_donate_success -- --nocapture
```
