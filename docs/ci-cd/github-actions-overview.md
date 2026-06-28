# GitHub Actions Overview

Every push and pull request to `main` triggers the CI/CD pipeline defined in `.github/workflows/ci.yml`.

---

## Pipeline Summary

| Job | Steps | Parallel? |
|---|---|---|
| `soroban-contracts` | Install Rust → `cargo test --workspace` | ✅ Yes |
| `frontend` | `npm ci` → `npm test` → `npm run build` | ✅ Yes |

Both jobs run in parallel. A push only proceeds to Vercel auto-deploy if both jobs pass.

---

## Workflow File

**`.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  soroban-contracts:
    name: Soroban Contract Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: wasm32-unknown-unknown

      - name: Cache cargo
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/registry
            ~/.cargo/git
            contract/target
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

      - name: Run contract tests
        working-directory: contract
        run: cargo test --workspace

  frontend:
    name: Frontend Tests + Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: CI=true npm test

      - name: Build
        run: npm run build
        env:
          REACT_APP_FUND_CONTRACT_ID: ${{ secrets.REACT_APP_FUND_CONTRACT_ID }}
          REACT_APP_SOROBAN_RPC_URL: ${{ secrets.REACT_APP_SOROBAN_RPC_URL }}
          REACT_APP_NETWORK_PASSPHRASE: "Test SDF Network ; September 2015"
```

---

## Triggering CI

CI runs automatically on:
- Every push to `main`
- Every pull request targeting `main`

You can also trigger manually from the GitHub Actions tab → **Run workflow**.

---

## Related Docs

- [Pipeline Jobs →](./pipeline-jobs.md)
- [Troubleshooting CI →](./troubleshooting-ci.md)
