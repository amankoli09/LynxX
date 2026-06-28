# Rollback Plan

This page outlines strategies for rolling back the frontend and smart contracts in case a deployment introduces a critical issue.

---

## Frontend Rollback (Vercel)

Vercel stores every successful deployment. Rolling back is instant:

### Via Vercel Dashboard (Recommended)
1. Go to Vercel Dashboard → Project → **Deployments**.
2. Find the last known-good deployment.
3. Click the three-dot menu → **Promote to Production**.
4. The previous build is immediately live — no rebuild required.

### Via Vercel CLI
```bash
vercel rollback [deployment-url]
```

### Estimated Recovery Time
< 30 seconds (instant promotion, no rebuild).

---

## Smart Contract Rollback

Soroban contracts are **immutable** — you cannot remove or revert a deployed contract. "Rollback" for contracts means:

### Option 1: Repoint the Frontend to the Old Contract

If the issue is in the new contract but the old contract is still valid:

1. Update `REACT_APP_FUND_CONTRACT_ID` in Vercel to the previous contract ID.
2. Trigger a Vercel redeploy (or promote the previous frontend deployment).
3. Users are now interacting with the old contract.

**Limitation:** Any state written to the new contract (donations, badge tiers) cannot be undone.

### Option 2: Emergency Withdraw

If the new contract has a critical bug and funds are at risk:
1. Call `fund.withdraw()` as the owner immediately to drain the contract balance.
2. Alert all donors via social channels.

### Option 3: Contract Freeze

If you added a `pause()` or `freeze()` method (not in the current version):
1. Call `pause()` as the owner to disable `donate()`.
2. Deploy a fixed contract and re-wire the frontend.

---

## Pre-Deployment Checklist (Prevents Need for Rollback)

- [ ] CI pipeline is green (`cargo test` + `npm test` + `npm run build`)
- [ ] Manual test plan completed (TC-1 through TC-24)
- [ ] Tested on Testnet with real Freighter signing
- [ ] Environment variables reviewed in Vercel before promoting
- [ ] At least one reviewer has reviewed the PR

---

## Emergency Contacts

| Role | Action |
|---|---|
| Contract owner | Call `withdraw()` to protect funds |
| Frontend owner | Promote previous Vercel deployment |
| Both | Coordinate via project communication channel |
