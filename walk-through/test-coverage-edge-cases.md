# Smart Contract Edge Cases & CI Coverage Walkthrough

This document outlines the recent additions made to test coverage and CI workflows to address the missing edge cases for the LynxX Soroban smart contracts.

## 1. Multiple Donors Test (`fund` contract)
The previous tests primarily focused on a single donor taking the happy path. We added a `test_multiple_donors` function in `contract/contracts/fund/src/test.rs`. 
- **What it verifies:** It checks that when two distinct addresses donate, the `client.donors()` counter increments correctly to 2, instead of counting the same address twice or confusing the totals. 
- **Validation:** Successfully passes and ensures our logic for `DataKey::Donors` is bulletproof.

## 2. Withdraw After Close Test (`fund` contract)
The campaign has a feature where it closes when the goal is reached, preventing further donations. 
- **What it verifies:** We added `test_withdraw_after_close` to ensure that even after `client.is_closed()` is true, the beneficiary can still securely call `client.withdraw()` to pull out the funds successfully. 
- **Validation:** Confirmed that the closed state correctly permits fund withdrawals.

## 3. Auth Boundaries Test (`badge` contract)
Previously, the badge tests used `env.mock_all_auths()`, which artificially bypasses all authorization checks during tests.
- **What it verifies:** We added `test_auth_boundaries_reject_unauthorized` in `contract/contracts/badge/src/test.rs`. This test **does not** mock auths. It simulates a rogue address attempting to call `award()`. Since the badge contract strictly requires auth from the `admin` (the fund contract), this unauthorized call rightfully panics and is rejected.
- **Validation:** Confirmed that the `require_auth()` trust boundaries are fully functional and secure.

## 4. CI Coverage Step (`ci.yml`)
To ensure we can track our testing progress automatically:
- **What was added:** We integrated `cargo-llvm-cov` into our GitHub Actions workflow (`.github/workflows/ci.yml`).
- **Validation:** Whenever a new Pull Request is opened or code is pushed to `main`, the CI pipeline will now automatically install `cargo-llvm-cov` and execute `cargo llvm-cov --all-features --workspace`. This outputs a highly readable code coverage table directly into our GitHub Actions logs, so you'll always know how well-tested the smart contracts are!
