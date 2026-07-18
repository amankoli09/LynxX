<div align="center">

# 🤝 Contributing to LynxX

**Thank you for your interest in contributing to LynxX!**
LynxX is a non-custodial Soroban smart contract crowdfunding platform on the Stellar network.

We welcome **all** contributions — bug fixes, features, docs, tests, and ideas.

[![Telegram](https://img.shields.io/badge/Community-Telegram-blue?logo=telegram)](https://t.me/+YEH0zvr-kTs2MDU9)
[![Issues](https://img.shields.io/github/issues/amankoli09/LynxX)](https://github.com/amankoli09/LynxX/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/amankoli09/LynxX/pulls)

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [SDK Development](#-sdk-development)
- [Smart Contract Development](#-smart-contract-development)
- [Community](#-community)

---

## 🛡️ Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
Please read it before contributing. We are committed to making this a welcoming space for everyone.

---

## 💡 Ways to Contribute

| Type | Description |
|---|---|
| 🐛 **Bug Report** | Found something broken? [Open a bug report](https://github.com/amankoli09/LynxX/issues/new?template=bug_report.md) |
| ✨ **Feature Request** | Have an idea? [Suggest a feature](https://github.com/amankoli09/LynxX/issues/new?template=feature_request.md) |
| 📝 **Documentation** | Improve docs, fix typos, add examples |
| 🔧 **Code** | Fix bugs or implement new features via a PR |
| 🧪 **Tests** | Add missing test coverage |
| 🌍 **Community** | Help others in Discussions or Telegram |

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/LynxX.git
cd LynxX
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/amankoli09/LynxX.git
```

### 3. Keep Your Fork in Sync

```bash
git fetch upstream
git merge upstream/main
```

### 4. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## 🛠️ Development Setup

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| pnpm | v8+ | `npm install -g pnpm` |
| Rust | latest stable | [rustup.rs](https://rustup.rs) |
| Soroban CLI | v22+ | `cargo install --locked soroban-cli` |

### Install Dependencies

```bash
pnpm install
```

### Running the Frontend

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### Running All Tests

```bash
pnpm test                        # Frontend + SDK tests
cd contract && cargo test        # Smart contract tests
```

### Linting

```bash
pnpm lint                        # Frontend + SDK linting
cd contract && cargo clippy      # Rust linting
```

---

## 📁 Project Structure

```
LynxX/
├── contract/                  # Soroban smart contracts (Rust)
│   └── contracts/
│       ├── fund/              # Crowdfunding contract
│       └── badge/             # Donor loyalty tier contract
├── docs/                      # Project documentation
├── packages/
│   └── lynxx-wallet-sdk/      # npm SDK for dApp integrations
│       ├── src/
│       │   ├── index.ts       # Entry point
│       │   ├── provider.ts    # Wallet provider class
│       │   └── types.ts       # TypeScript interfaces
│       └── dist/              # Compiled output (auto-generated)
├── src/                       # Next.js frontend source
│   ├── components/            # React components
│   └── app/                   # App router pages
├── public/                    # Static assets
└── .github/                   # Workflows & issue templates
```

---

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependency updates, CI changes |
| `perf` | Performance improvements |

### Scopes

| Scope | Area |
|---|---|
| `contract` | Soroban smart contracts |
| `sdk` | lynxx-wallet-sdk package |
| `ui` | Frontend / React components |
| `ci` | GitHub Actions / workflows |
| `docs` | Documentation files |

### Examples

```
feat(contract): add TTL extension to donate function
fix(ui): resolve hardcoded RPC source account
docs(sdk): add README with API reference
chore(ci): add npm publish workflow for sdk releases
test(contract): add unit tests for badge tier calculation
```

---

## 🔀 Pull Request Process

1. **Ensure your branch is up to date** with `main`:
   ```bash
   git fetch upstream && git rebase upstream/main
   ```

2. **Run tests** before pushing:
   ```bash
   pnpm test
   cd contract && cargo test
   ```

3. **Push your branch:**
   ```bash
   git push origin feat/your-feature-name
   ```

4. **Open a Pull Request** against `main` on GitHub.

5. **Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md)** completely:
   - Describe what changed and why
   - Link the related issue (e.g., `Closes #42`)
   - Add screenshots for UI changes

6. **Address review feedback** promptly. A maintainer will review within **2–3 business days**.

7. Once approved, a maintainer will **squash and merge** your PR.

> ⚠️ PRs without passing CI checks will not be merged.

---

## 📦 SDK Development

The `lynxx-wallet-sdk` is a standalone npm package inside the monorepo.

```bash
cd packages/lynxx-wallet-sdk

# Install
pnpm install

# Build (compiles TypeScript → dist/)
pnpm build

# Watch mode (rebuilds on file change)
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint
```

### Publishing (Maintainers Only)

The SDK auto-publishes to npm via GitHub Actions when a release tagged `lynxx-wallet-sdk-v*` is created.

To trigger a publish:
1. Bump the version in `packages/lynxx-wallet-sdk/package.json`
2. Create a GitHub Release with tag `lynxx-wallet-sdk-v<version>`

---

## ⛓️ Smart Contract Development

Contracts live in `contract/contracts/` and are written in Rust targeting Soroban.

```bash
cd contract

# Run all contract tests
cargo test

# Build WASM for testnet deployment
rustup target add wasm32v1-none
cargo build --target wasm32v1-none --release -p fund

# Lint
cargo clippy -- -D warnings

# Format
cargo fmt
```

### Testnet Deployment

Refer to the [deployment docs](docs/) for step-by-step instructions on deploying to Stellar Testnet using `soroban-cli`.

---

## 🌍 Community

| Platform | Link |
|---|---|
| 💬 Telegram | [Join our group](https://t.me/+YEH0zvr-kTs2MDU9) |
| 🐛 Issues | [GitHub Issues](https://github.com/amankoli09/LynxX/issues) |
| 💡 Discussions | [GitHub Discussions](https://github.com/amankoli09/LynxX/discussions) |

---

<div align="center">

**Thank you for making LynxX better! 🌟**

*Every contribution, no matter how small, makes a difference.*

</div>
