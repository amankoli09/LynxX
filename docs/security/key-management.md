# Key Management

This document explains how cryptographic keys are managed across the StellarFund + StellarFlow project.

---

## User Keys (Wallet Keys)

User private keys are **exclusively managed by Freighter**:

- Stored encrypted in the browser extension's local storage (not accessible to the page).
- Never transmitted over the network.
- Protected by the user's Freighter password (derived via PBKDF2 or similar).
- Used only when the user explicitly approves a transaction signing request.

StellarFlow **never** has access to user private keys at any point.

---

## Owner/Deployer Keys (Contract Admin)

The `owner` key is the keypair that deployed the `fund` contract and has the right to call `withdraw()`.

### Testnet Best Practices

For Testnet, a single deployer keypair is acceptable. Store it in the Stellar CLI keychain:

```bash
stellar keys generate --global deployer --network testnet
stellar keys list
```

Keys are stored in `~/.config/stellar/identity/` — **never commit this directory to git.**

### Mainnet Best Practices

For any Mainnet deployment:
- Use a **hardware wallet** (Ledger) for the owner keypair.
- Consider a **multi-signature** setup (M-of-N signers) for the owner role.
- Store backups of recovery phrases **offline** (paper, metal).
- Rotate keys if compromised — requires redeploying the contract with the new owner address in the constructor.

---

## CI/CD Keys

The GitHub Actions workflow requires access to environment variables but NOT private keys. Never store a Stellar private key (starts with `S`) as a GitHub secret.

The workflow only needs:
- Public contract IDs
- RPC URLs
- Network passphrases

---

## `.gitignore` Rules

The project's `.gitignore` excludes:
```
.env
.env.local
.env.*.local
~/.config/stellar/
*.secret
```

Verify with:
```bash
git status  # .env should not appear as untracked
```

---

## Key Rotation

If the owner key is compromised:
1. The current contract has no built-in key rotation (there is no `set_owner()` method).
2. A new contract must be deployed with a fresh `owner` address.
3. Existing funds can only be withdrawn by the original (compromised) key — **prevention is critical**.
4. Add a `transfer_ownership(new_owner)` method before Mainnet deployment.

---

## Related Docs

- [Non-Custodial Model →](./non-custodial-model.md)
- [Auth — require_auth →](./auth-require_auth.md)
- [Threat Model →](./threat-model.md)
