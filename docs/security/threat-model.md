# Threat Model

This document identifies potential threats to StellarFund + StellarFlow and the mitigations in place.

---

## Assets to Protect

| Asset | Value | Owner |
|---|---|---|
| Donor XLM held by the fund contract | Financial | Donor collective |
| Campaign owner's withdrawal rights | Financial | Owner keypair |
| User's private key | Identity + financial | User (in Freighter) |
| Badge tier data | Reputational | Donor |

---

## Threat Matrix

### T1: Malicious dApp Steals Private Keys

**Description:** A phishing site impersonates StellarFlow and tricks users into revealing seed phrases.

**Mitigations:**
- StellarFlow never asks for seed phrases or private keys.
- Freighter signing always shows the dApp origin — users can verify `localhost:3000` or the Vercel URL.
- Open-source code — users can inspect what the dApp does.

**Residual Risk:** Low (user must actively ignore all warnings).

---

### T2: Fund Contract Drained by Attacker

**Description:** An attacker calls `withdraw()` to drain the contract balance.

**Mitigations:**
- `withdraw()` requires `owner.require_auth()` — only the holder of the owner private key can call it.
- The owner key is never stored in the dApp or on any server.

**Residual Risk:** Low. Only becomes high if the owner key is compromised.

---

### T3: Donation Spoofing

**Description:** An attacker donates on behalf of another user (`from` = victim).

**Mitigations:**
- `donate()` requires `from.require_auth()` — the victim's signature is required.
- The attacker cannot forge this without the victim's private key.

**Residual Risk:** None (cryptographic guarantee).

---

### T4: Badge Tier Manipulation

**Description:** An attacker mints a Gold badge for themselves without donating.

**Mitigations:**
- `badge.award()` requires `admin.require_auth()` where `admin` is the **fund contract's address**.
- External callers cannot satisfy this auth check.

**Residual Risk:** None (cryptographic guarantee).

---

### T5: Replay Attack

**Description:** An attacker replays a signed transaction to donate twice from the same XDR.

**Mitigations:**
- Each Stellar transaction has a **sequence number** tied to the sending account. Replay is prevented at the protocol level.
- Soroban auth entries include ledger bounds — they expire after a set number of ledgers.

**Residual Risk:** None (protocol-level protection).

---

### T6: localStorage History Tampering

**Description:** An attacker modifies `localStorage` to fake transaction history.

**Impact:** Local display only — no on-chain or financial impact. The real history is always available on Stellar Expert.

**Residual Risk:** Negligible.

---

### T7: Supply Chain Attack (npm Dependency)

**Description:** A malicious npm package is injected into the build.

**Mitigations:**
- `npm ci` uses exact versions from `package-lock.json`.
- CI builds verify the exact lock file.
- Minimal dependencies (no heavy frameworks beyond React and stellar-sdk).

**Residual Risk:** Medium (inherent to all npm projects — monitor for advisories).

---

## Out of Scope

- Stellar network-level attacks (handled by SDF/consensus)
- Physical access to the user's device
- Browser exploits targeting Freighter
