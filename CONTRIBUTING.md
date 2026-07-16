# Contributing to LynxX

Thank you for your interest in contributing to **LynxX** — a Soroban smart contract crowdfunding platform on the Stellar Testnet! 🚀

We welcome all kinds of contributions: bug fixes, new features, documentation improvements, and more.

## Community

### Join our Telegram: https://t.me/+YEH0zvr-kTs2MDU9
---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/LynxX.git
   cd LynxX
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/amankoli09/LynxX.git
   ```
4. **Install dependencies:**
   ```bash
   pnpm install
   ```

---

## How to Contribute

### 🐛 Reporting Bugs
- Use the [Bug Report issue template](.github/ISSUE_TEMPLATE/bug_report.md).
- Include a clear description, steps to reproduce, expected vs. actual behavior, and environment details.

### ✨ Suggesting Features
- Use the [Feature Request issue template](.github/ISSUE_TEMPLATE/feature_request.md).
- Explain the problem you're solving and your proposed solution.

### 🔧 Submitting Code
- All contributions go through a **Pull Request (PR)**.
- One feature/fix per PR — keep PRs focused and small.
- Reference the related issue in your PR description (e.g., `Closes #42`).

---

## Development Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18+ |
| pnpm | v8+ |
| Rust | latest stable |
| Soroban CLI | v22+ |

### Running the Frontend

```bash
pnpm dev
```

### Running Smart Contract Tests

```bash
cd contract
cargo test
```

### Building the SDK

```bash
cd packages/lynxx-wallet-sdk
pnpm build
```

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependency updates, etc. |

**Examples:**
```
feat(contract): add TTL extension to donate function
fix(ui): resolve hardcoded RPC source account
docs(readme): update contract deployment table
```

---

## Pull Request Process

1. Create a branch from `main` with a descriptive name:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes with clear, atomic commits.
3. Ensure all tests pass:
   ```bash
   pnpm test        # Frontend tests
   cd contract && cargo test  # Smart contract tests
   ```
4. Push your branch and open a PR against `main`.
5. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely.
6. A maintainer will review your PR within 2–3 business days.
7. Address review feedback promptly. Once approved, a maintainer will merge it.

---

## Project Structure

```
LynxX/
├── contract/          # Soroban smart contracts (Rust)
├── docs/              # Project documentation
├── packages/          # Shared packages (e.g., lynxx-wallet-sdk)
├── public/            # Static assets
├── src/               # React frontend source
└── .github/           # GitHub workflows & templates
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/amankoli09/LynxX/discussions) or reach out via an issue. We're happy to help!

Thank you for making LynxX better! 🌟
