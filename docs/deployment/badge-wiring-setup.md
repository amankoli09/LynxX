# Badge Wiring Setup

After deploying both the `fund` and `badge` contracts, you must register the badge contract with the fund contract so cross-contract calls work correctly.

---

## Why Wiring is Required

The `fund` contract only calls `badge.award()` if a badge contract ID has been registered via `fund.set_badge()`. Without this step, donations succeed but no badge tiers are assigned.

---

## Step-by-Step

### 1. Deploy the Badge Contract

Deploy the badge contract with the **fund contract's address** as the admin:

```bash
stellar contract deploy \
  --wasm contract/target/wasm32-unknown-unknown/release/badge.wasm \
  --source-account deployer \
  --network testnet \
  -- --admin $FUND_CONTRACT_ID
```

Save the output:
```bash
export BADGE_CONTRACT_ID=C...
```

---

### 2. Register the Badge in the Fund Contract

Call `set_badge()` as the owner of the fund contract:

```bash
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --source-account $OWNER_KEYPAIR \
  --network testnet \
  -- set_badge \
  --badge $BADGE_CONTRACT_ID
```

---

### 3. Verify the Wiring

Make a test donation and check the badge tier:

```bash
# Make a donation (as a test donor)
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --source-account $DONOR_KEYPAIR \
  --network testnet \
  -- donate \
  --from $DONOR_ADDRESS \
  --amount 10000000

# Check badge tier
stellar contract invoke \
  --id $BADGE_CONTRACT_ID \
  --network testnet \
  -- tier \
  --donor $DONOR_ADDRESS
```

Expected output: `1` (Bronze)

---

## Re-Wiring (Badge Contract Upgrade)

If you deploy a new badge contract:

1. Deploy the new badge with `--admin $FUND_CONTRACT_ID`.
2. Call `fund.set_badge(new_badge_id)` again as the owner.
3. Future donations will use the new badge contract.
4. Existing tiers in the old contract are not migrated automatically.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `set_badge` fails with auth error | Make sure `--source-account` matches the `owner` address set at fund deployment |
| Badge tier returns 0 | `set_badge` was not called, or wrong badge contract ID |
| Cross-contract test fails | Check that `badge.admin` is set to the fund contract's address, not the deployer |
