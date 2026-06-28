# Pipeline Jobs

Detailed breakdown of each job in the `.github/workflows/ci.yml` CI/CD pipeline.

---

## Job 1: `soroban-contracts`

**Runner:** `ubuntu-latest`
**Duration:** ~3–5 minutes

### Steps

| Step | Action | Purpose |
|---|---|---|
| `checkout` | `actions/checkout@v4` | Clone the repository |
| `install-rust` | `dtolnay/rust-toolchain@stable` | Install stable Rust + `wasm32-unknown-unknown` target |
| `cache-cargo` | `actions/cache@v4` | Cache cargo registry and `contract/target` |
| `test-contracts` | `cargo test --workspace` | Run all 11 contract tests (fund + badge) |

### Success Criteria
- All 11 tests pass: `test result: ok. 11 passed; 0 failed`

### Failure Indicators
- `FAILED` in cargo output
- Compile errors in Rust code
- Missing dependency in `Cargo.toml`

---

## Job 2: `frontend`

**Runner:** `ubuntu-latest`
**Duration:** ~2–4 minutes

### Steps

| Step | Action | Purpose |
|---|---|---|
| `checkout` | `actions/checkout@v4` | Clone the repository |
| `setup-node` | `actions/setup-node@v4` (Node 20) | Install Node.js with npm cache |
| `install-deps` | `npm ci` | Install exact dependencies from `package-lock.json` |
| `test` | `CI=true npm test` | Run 9 Jest unit tests (non-interactive) |
| `build` | `npm run build` | Production build — catches TypeScript/JSX errors |

### Environment Variables Injected at Build

| Variable | Source |
|---|---|
| `REACT_APP_FUND_CONTRACT_ID` | GitHub Repository Secret |
| `REACT_APP_SOROBAN_RPC_URL` | GitHub Repository Secret |
| `REACT_APP_NETWORK_PASSPHRASE` | Hardcoded in workflow |

### Success Criteria
- All 9 Jest tests pass
- `npm run build` completes without errors
- `build/` directory created with `index.html`

### Failure Indicators
- Jest test failures
- React compilation errors
- Missing environment variables causing build errors

---

## Vercel Deployment

Vercel auto-deploy is **not** managed by this GitHub Actions workflow — it is a separate Vercel integration that triggers on every push to `main` via a GitHub App. The CI workflow only gates code quality; Vercel deploys independently.

To link: Vercel Dashboard → Import Project → GitHub → select repo → enable auto-deploy on `main`.

---

## Related Docs

- [GitHub Actions Overview →](./github-actions-overview.md)
- [Troubleshooting CI →](./troubleshooting-ci.md)
- [Frontend Deployment — Vercel →](../deployment/frontend-deployment-vercel.md)
