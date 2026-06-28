# Test Coverage

This page summarises the current test coverage across the StellarFund + StellarFlow project.

---

## Coverage Summary

| Layer | Tests | Automated | Coverage Areas |
|---|---|---|---|
| Soroban contracts (Rust) | **11** | ✅ | donate, withdraw, badge award, cross-contract, auth |
| Frontend utilities (Jest) | **9** | ✅ | stroop conversion, address validation, tier naming |
| Integration (React components) | 0 | ❌ | Planned — see [Integration Tests](./integration-tests.md) |
| End-to-end | 0 | ❌ | Covered by [Manual Test Plan](./manual-test-plan.md) |

---

## Contract Test Coverage

**File:** `contract/contracts/fund/src/test.rs` + `contract/contracts/badge/src/test.rs`

| Test | What is Covered |
|---|---|
| `test_donate_zero_amount` | ZeroAmount error path |
| `test_donate_success` | Token transfer, raised increment, donor count |
| `test_campaign_closes_at_goal` | Closed flag, CampaignClosed error |
| `test_withdraw_success` | Owner withdrawal, balance transfer |
| `test_withdraw_nothing_raised` | NothingRaised error path |
| `donation_awards_badge_cross_contract` | Full cross-contract call path |
| `test_award_bronze` | Badge tier 1 assignment |
| `test_award_silver` | Badge tier 2 assignment |
| `test_award_gold` | Badge tier 3 assignment |
| `test_award_unauthorized` | Auth rejection for non-admin caller |
| `test_tier_query` | `tier()` read function |

---

## Frontend Test Coverage

**File:** `src/lib/stellar.test.js`

| Test | Function | Case |
|---|---|---|
| 1 | `toStroops` | 1 XLM → 10,000,000 stroops |
| 2 | `toStroops` | 0.5 XLM → 5,000,000 stroops |
| 3 | `toStroops` | Non-numeric → BigInt(0) |
| 4 | `fromStroops` | 10,000,000 → 1 XLM |
| 5 | `fromStroops` | BigInt input |
| 6 | `isValidStellarAddress` | Valid G... address |
| 7 | `isValidStellarAddress` | Wrong prefix (not G) |
| 8 | `isValidStellarAddress` | Wrong length |
| 9 | `tierName` | All 4 values: None/Bronze/Silver/Gold |

---

## Uncovered Areas

| Area | Risk | Mitigation |
|---|---|---|
| `Freighter.js` component | Medium | Manual tests TC-1 through TC-5 |
| `Fund.js` Soroban RPC calls | Medium | Manual tests TC-13 through TC-17 |
| Send XLM form validation | Low | Manual tests TC-6 through TC-10 |
| localStorage history | Low | Manual tests TC-18 through TC-20 |
| WebGL / LightRays | Low | Visual review |

---

## Improving Coverage

Priority order for new automated tests:
1. **Integration:** Freighter connect flow with mocked API
2. **Integration:** Send XLM with mocked Soroban RPC
3. **Integration:** Address validation UI feedback
4. **E2E:** Playwright or Cypress test against deployed Testnet app
