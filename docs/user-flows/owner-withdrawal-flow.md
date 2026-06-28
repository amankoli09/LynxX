# Owner Withdrawal Flow

This document describes the process for the campaign owner to withdraw funds after the campaign goal is reached.

---

## Prerequisites

- [ ] Campaign goal reached (`is_closed = true`)
- [ ] Owner has the private key for the `owner` address (set at contract deployment)
- [ ] Freighter configured with the owner keypair (or use Stellar CLI)

---

## Check Campaign Status

Before withdrawing, verify the campaign is closed:

### Via dApp

The Crowdfund panel shows a "Campaign Goal Reached!" message and enables the Withdraw button when `is_closed = true`.

### Via CLI

```bash
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --network testnet \
  -- is_closed
# → true

stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --network testnet \
  -- raised
# → 10000000000 (stroops = 1000 XLM)
```

---

## Withdraw via Freighter (dApp)

1. Connect the **owner** wallet to the dApp.
2. Navigate to the Campaign panel.
3. Click **Withdraw Funds** (only visible when `is_closed = true` and connected address = owner).
4. Review and approve the transaction in Freighter.
5. The entire contract balance is transferred to the owner's address.

---

## Withdraw via Stellar CLI

```bash
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --source-account $OWNER_KEYPAIR \
  --network testnet \
  -- withdraw
```

---

## What Happens On-Chain

```
owner calls withdraw()
    │
    ▼
owner.require_auth() → verified (owner's keypair signed the tx)
    │
    ▼
Check raised > 0 → NothingRaised error if 0
    │
    ▼
TokenClient::transfer(contract, owner, full_balance)
    │
    ▼
Emit Withdrawn { owner, amount } event
```

---

## After Withdrawal

- The contract holds zero XLM.
- `donors()` and `raised()` still return their values (storage is preserved).
- `is_closed` remains `true` — no further donations can be accepted.
- The owner's balance increases by the withdrawn amount.

---

## Error Cases

| Error | Cause | Fix |
|---|---|---|
| `NothingRaised (3)` | No donations received | Wait for donations |
| Auth failure | Wrong keypair signing | Use the original owner keypair |
| `CampaignClosed` (on donate) | Attempting to donate after closed | Expected — campaign is over |

---

## Related Docs

- [Fund Contract →](../smart-contracts/fund-contract.md)
- [Auth — require_auth →](../security/auth-require_auth.md)
