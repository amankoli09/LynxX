# Troubleshooting CI

Common CI/CD failures and how to resolve them.

---

## Soroban Contract Job Failures

### `error[E0433]: failed to resolve: use of undeclared crate`

**Cause:** Missing dependency in `contract/Cargo.toml` or `Cargo.lock` is out of sync.

**Fix:**
```bash
cd contract
cargo update
# Commit the updated Cargo.lock
```

---

### `error: linker 'cc' not found`

**Cause:** Rust linker not available in the CI runner.

**Fix:** Add a `build-essential` install step:
```yaml
- name: Install build tools
  run: sudo apt-get install -y build-essential
```

---

### `test result: FAILED. X passed; Y failed`

**Cause:** A contract test is failing. The output shows which test panicked.

**Fix:** Read the test output, reproduce locally with:
```bash
cd contract
cargo test failing_test_name -- --nocapture
```

---

## Frontend Job Failures

### `npm ci` fails: `EINTEGRITY`

**Cause:** `package-lock.json` is out of sync with `package.json`.

**Fix:**
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

---

### Jest: `Cannot find module './stellar'`

**Cause:** Import path in test file doesn't match the actual file location.

**Fix:** Check that `src/lib/stellar.js` exists and the test imports from the correct relative path.

---

### `npm run build` fails: `REACT_APP_FUND_CONTRACT_ID is not defined`

**Cause:** The GitHub Repository Secret is not set.

**Fix:**
1. Go to GitHub → Repository → Settings → Secrets and variables → Actions.
2. Add `REACT_APP_FUND_CONTRACT_ID` with the Testnet contract ID.
3. Re-run the failed workflow.

---

### `HTTPS` warning in CI environment

The `HTTPS=true` flag in `npm start` is only for the dev server. `npm run build` does not use it — no fix needed.

---

## General Tips

| Issue | Solution |
|---|---|
| CI passes locally but fails in CI | Check Node/Rust version mismatch |
| Workflow not triggering | Verify branch name matches `on.push.branches: [main]` |
| Cached dependencies stale | Change the cache key to force rebuild |
| Secrets not injected | Confirm secret names match exactly (case-sensitive) |

---

## Re-running a Failed Job

From GitHub Actions:
1. Click the failed workflow run.
2. Click **Re-run failed jobs** (top right).

Or re-run all jobs:
```
Re-run all jobs → Confirm
```
