# Upgrade Strategy

Soroban contracts are immutable once deployed — their code cannot be changed in place. This document outlines how to handle upgrades safely for this project.

---

## Current Status

Both contracts (`fund` and `badge`) are deployed to Stellar Testnet for development purposes. No Mainnet upgrade strategy is required at this stage.

---

## Soroban Upgrade Options

### Option 1: Redeploy a New Contract

The simplest approach: deploy a new contract instance with updated code and migrate data if necessary.

**Suitable for:** Testnet iterations, new campaign cycles.

**Steps:**
1. Modify the contract source (`lib.rs`).
2. Build: `stellar contract build`
3. Deploy the new contract.
4. Update the frontend environment variable (`REACT_APP_FUND_CONTRACT_ID`) to the new ID.
5. Re-run `set_badge()` to re-wire the badge contract.

**Limitation:** Historical on-chain data (donations, donor records) stays on the old contract address.

---

### Option 2: `update_current_contract_wasm`

Soroban supports in-place WASM upgrades using the host function `e.deployer().update_current_contract_wasm(new_wasm_hash)`. This replaces the contract's code while preserving its storage.

**Steps:**
1. Build the new WASM: `stellar contract build`
2. Upload the new WASM to the network to get a hash:
   ```bash
   stellar contract upload --wasm target/wasm32-unknown-unknown/release/fund.wasm --network testnet
   ```
3. Invoke an `upgrade()` method (must be added to the contract with `owner` auth guard) that calls `update_current_contract_wasm`.
4. All existing storage (donations, donor counts) is preserved.

**Requirement:** An `upgrade()` method must be built into the contract from the start. The current version does not include one — add it before Mainnet deployment.

---

## Badge Contract Upgrade

Upgrading the badge contract is independent of the fund contract. After deploying a new badge contract:

1. Deploy new `badge` WASM.
2. Call `fund.set_badge(new_badge_id)` with the owner keypair.
3. The fund contract will begin calling the new badge contract for all future donations.
4. Existing tiers stored in the old badge contract are not automatically migrated.

---

## Data Migration

For significant schema changes (e.g. adding new storage keys), write a migration function that reads old keys and writes new keys during a one-time admin call.

---

## Pre-Mainnet Checklist

Before any Mainnet deployment:
- [ ] Add an `upgrade(new_wasm_hash)` method guarded by `owner.require_auth()`
- [ ] Conduct a full security audit (see [Audit Checklist](../security/audit-checklist.md))
- [ ] Test upgrade path on Testnet with real data migration
- [ ] Set a multi-sig admin key for the `owner` role
- [ ] Decide on a campaign duration / auto-close mechanism

---

## Immutability as a Feature

Until an `upgrade()` method is added, the deployed contracts are **fully immutable**. This is desirable for trust: donors can verify the contract code on the Stellar Explorer and be certain it cannot be changed unilaterally. Consider leaving the contract non-upgradeable on Mainnet if trust is the priority.
