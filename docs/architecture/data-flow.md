# Data Flow

This document traces how data moves through StellarFlow — from the user clicking "Connect" all the way to an on-chain transaction confirmation.

---

## 1. Wallet Connection Flow

```
User clicks "Connect"
      │
      ▼
Freighter.js → setAllowed()
      │  (user approves in Freighter popup)
      ▼
Freighter.js → requestAccess()
      │  returns: G... public key
      ▼
Header.js sets walletAddress state
      │
      ▼
Horizon REST API → /accounts/{address}
      │  returns: balances array
      ▼
Header.js sets balance state → UI renders balance
```

---

## 2. Send XLM Flow

```
User enters recipient address + amount
      │
      ▼
lib/stellar.js → isValidStellarAddress(recipient)   [client-side]
lib/stellar.js → toStroops(amount)                   [client-side]
      │
      ▼
Fund.js / Freighter.js → stellar-sdk builds PaymentOperation
      │
      ▼
Soroban RPC → simulateTransaction(xdr)
      │  returns: fee + footprint
      ▼
Freighter.js → signTransaction(xdr, { network: "TESTNET" })
      │  user signs in Freighter popup
      ▼
Soroban RPC → sendTransaction(signedXdr)
      │
      ▼
Poll getTransaction(hash) until status ≠ NOT_FOUND
      │
      ├─ SUCCESS → update balance, append to localStorage history, show green badge
      └─ FAILED  → show FundError message
```

---

## 3. Donation Flow (Crowdfund Panel)

```
User enters donation amount in Crowdfund.js
      │
      ▼
Fund.js builds a Soroban InvokeContractOp
  → contract: FUND_CONTRACT_ID
  → method:   "donate"
  → args:     [from: Address, amount: i128 stroops]
      │
      ▼
Soroban RPC → simulateTransaction
      │  receives: auth entries, footprint, fee
      ▼
Freighter.js → signTransaction(assembled XDR)
      │
      ▼
Soroban RPC → sendTransaction
      │  on-chain execution:
      │    fund.donate() → records donation
      │                 → cross-calls badge.award(from, total)
      │                 → emits Donated { from, amount, total } event
      ▼
Poll for confirmation → update campaign stats in UI
```

---

## 4. Cross-Contract Data Flow (fund → badge)

```
fund.donate(from, amount)
  ├─ Update storage: raised, donors map, per-donor total
  ├─ Check: is campaign closed?
  └─ If badge contract registered:
       BadgeClient::new(&env, &badge_id)
         .award(&from, &donor_total)   ← cross-contract call (same tx)
           badge.award()
             ├─ require_auth() [admin = fund contract address]
             ├─ Determine tier from donor_total
             │    < 10 XLM   → Bronze (1)
             │    < 100 XLM  → Silver (2)
             │    ≥ 100 XLM  → Gold   (3)
             └─ Write tier to badge persistent storage
```

---

## 5. Event Streaming Flow

```
Fund.js → getRecentDonations()
      │
      ▼
Horizon REST API → /accounts/{contract}/effects OR
Soroban RPC    → getEvents({ contractId, topic: ["Donated"] })
      │  returns: array of { from, amount, total } events
      ▼
Crowdfund.js renders live activity feed (most recent first)
```

---

## State Transitions Summary

| Action | State Before | State After |
|---|---|---|
| Click Connect | `disconnected` | `connecting` |
| Freighter approves | `connecting` | `connected` (address + balance loaded) |
| Submit send form | `idle` | `pending` |
| Transaction confirms | `pending` | `success` (balance refreshed) |
| Transaction fails | `pending` | `error` (error message shown) |
| Campaign goal hit | `open` | `closed` (withdraw enabled for owner) |
