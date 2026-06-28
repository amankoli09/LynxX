# Audit Checklist

Pre-audit and pre-Mainnet security checklist for StellarFund + StellarFlow.

---

## Smart Contract Checklist

### Access Control
- [ ] `withdraw()` is protected by `owner.require_auth()`
- [ ] `set_badge()` is protected by `owner.require_auth()`
- [ ] `badge.award()` is protected by `admin.require_auth()` where `admin = fund contract`
- [ ] No method allows arbitrary callers to move funds

### Integer Arithmetic
- [ ] All monetary values use `i128` (no floating-point)
- [ ] No integer overflow possible in `raised` accumulation (i128 max ≫ campaign goal)
- [ ] `toStroops()` uses `BigInt.round()` to avoid float truncation

### Reentrancy
- [ ] Soroban's execution model prevents classical reentrancy (no `call` patterns)
- [ ] Cross-contract call to `badge.award()` occurs after state is written (safe pattern)

### Token Handling
- [ ] SAC `transfer()` is called before marking donation as successful? (Review order)
- [ ] `withdraw()` transfers the full current balance — no stale cached amount used

### Error Handling
- [ ] All error paths return typed `FundError` (no uncaught panics in happy paths)
- [ ] Campaign closed state is correctly set and checked

### Storage
- [ ] Instance storage keys are consistent across all methods
- [ ] Persistent storage has TTL management for Mainnet (rent payment)

---

## Frontend Checklist

### Key Security
- [ ] No private key or seed phrase input anywhere in the dApp
- [ ] No `localStorage` storage of sensitive data
- [ ] `.env` is in `.gitignore` and not committed

### Input Validation
- [ ] All user inputs are validated before transaction building
- [ ] Stellar address validation uses `isValidStellarAddress()`
- [ ] Amount validation rejects 0 and negative values

### Dependencies
- [ ] `npm audit` passes with no high/critical vulnerabilities
- [ ] All dependencies pinned via `package-lock.json`

### XSS Prevention
- [ ] No `dangerouslySetInnerHTML` usage
- [ ] No user input rendered as raw HTML

---

## Deployment Checklist

### Pre-Mainnet
- [ ] Full security audit by an independent auditor
- [ ] Upgrade mechanism (`upgrade()` method) added and tested
- [ ] Owner key is on hardware wallet (Ledger)
- [ ] Multi-sig considered for owner role
- [ ] Testnet reset tested: full redeploy and re-wiring works
- [ ] TTL/rent management strategy defined

### CI/CD
- [ ] CI pipeline is green (all tests pass)
- [ ] No secrets committed to git history
- [ ] Vercel environment variables set and verified

---

## Sign-Off

| Reviewer | Date | Status |
|---|---|---|
| Developer self-review | — | ⬜ |
| Peer code review | — | ⬜ |
| External audit | — | ⬜ |
| Mainnet deployment approved | — | ⬜ |
