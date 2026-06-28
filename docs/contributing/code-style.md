# Code Style

This document defines the coding conventions for StellarFlow (JavaScript/React) and the StellarFund contracts (Rust).

---

## JavaScript / React

### Formatting

- **2 spaces** for indentation.
- **Single quotes** for strings (`'hello'` not `"hello"`).
- **Trailing commas** in multi-line arrays and objects.
- **Semicolons:** use them.
- Max line length: **100 characters**.

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `walletAddress` |
| Functions | `camelCase` | `fetchBalance()` |
| React components | `PascalCase` | `Crowdfund`, `Header` |
| Constants | `UPPER_SNAKE_CASE` | `STROOPS`, `FUND_CONTRACT_ID` |
| CSS classes | `kebab-case` | `.glass-panel`, `.btn-primary` |

### React Conventions

- Use **functional components** and React Hooks (no class components).
- Keep components focused — extract logic into separate files when a component exceeds ~200 lines.
- Co-locate styles with components via CSS Modules or global `App.css` classes.
- Prop types: use JSDoc comments for documentation (no TypeScript in this project).

### Comments

```js
// Short single-line comments for non-obvious logic

/**
 * JSDoc for public functions with parameters and return values.
 * @param {string} xlm - XLM amount
 * @returns {BigInt} stroops
 */
export function toStroops(xlm) { ... }
```

---

## Rust / Soroban Contracts

### Formatting

Use `rustfmt` (run automatically with `cargo fmt`):

```bash
cd contract
cargo fmt
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Variables | `snake_case` | `donor_total` |
| Functions | `snake_case` | `donate()`, `require_auth()` |
| Types/Structs | `PascalCase` | `FundError`, `DataKey` |
| Constants | `UPPER_SNAKE_CASE` | `STROOPS` |
| Contract methods | `snake_case` | `set_badge()` |

### Documentation

```rust
/// Accepts a donation from `from` in the native XLM token.
/// 
/// # Errors
/// - `ZeroAmount` if `amount <= 0`
/// - `CampaignClosed` if the campaign goal has been reached
pub fn donate(env: Env, from: Address, amount: i128) -> Result<i128, FundError> {
```

---

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): brief description

[optional body]
[optional footer]
```

| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `refactor` | Code change with no feature/fix |
| `chore` | Build, tooling, or dependency updates |

**Examples:**
```
feat(crowdfund): add donation progress animation
fix(stellar): handle non-numeric input in toStroops
docs(readme): add live demo screenshots
test(fund): add withdrawal edge case test
```

---

## Linting

```bash
# JavaScript (via react-scripts)
npm run lint  # (if configured)

# Rust
cd contract && cargo clippy -- -D warnings
```
