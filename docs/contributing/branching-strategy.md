# Branching Strategy

This document defines the Git branching conventions for the StellarFund + StellarFlow project.

---

## Branch Model

The project uses a simplified **GitHub Flow** model:

```
main
├── feat/add-donation-animation
├── fix/balance-refresh-bug
├── docs/update-readme
└── chore/upgrade-stellar-sdk
```

- **`main`** — always deployable. Pushes to `main` trigger CI and Vercel auto-deploy.
- **Feature branches** — created from `main`, merged back via PR.
- No `develop` or `release` branches for this project (single-environment Testnet).

---

## Branch Naming Convention

```
<type>/<short-description>
```

| Type | When | Example |
|---|---|---|
| `feat` | New feature | `feat/badge-tier-display` |
| `fix` | Bug fix | `fix/freighter-connect-error` |
| `docs` | Documentation | `docs/add-deployment-guide` |
| `test` | Tests only | `test/integration-wallet-connect` |
| `refactor` | Code cleanup | `refactor/extract-stellar-helpers` |
| `chore` | Tooling, deps | `chore/upgrade-ogl-v2` |

Use **lowercase** and **hyphens** (no underscores, no spaces).

---

## Workflow

```bash
# 1. Pull latest main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/your-feature-name

# 3. Make changes, commit often
git add .
git commit -m "feat: add donation progress bar"

# 4. Push and open PR
git push origin feat/your-feature-name
# → Open Pull Request on GitHub targeting `main`

# 5. After PR is merged, delete the branch
git branch -d feat/your-feature-name
git push origin --delete feat/your-feature-name
```

---

## Pull Request Rules

- Every change to `main` must go through a PR.
- CI must pass (GitHub Actions green) before merging.
- At least one review approval required (for team projects).
- Squash merge preferred to keep `main` history clean.

---

## Hotfixes

For urgent production fixes:

```bash
git checkout main
git checkout -b fix/urgent-tx-failure
# ... make fix, test ...
git push origin fix/urgent-tx-failure
# Open PR → merge immediately after CI passes
```

---

## Protected Branch

`main` should be configured as a **protected branch** in GitHub:
- Settings → Branches → Branch protection rules → `main`
- Enable: **Require status checks to pass** (CI pipeline)
- Enable: **Require a pull request before merging**
