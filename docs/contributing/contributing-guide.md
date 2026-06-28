# Contributing Guide

Thank you for your interest in contributing to StellarFund + StellarFlow! This guide explains how to get involved.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Stellar-Connect-Wallet.git
   cd Stellar-Connect-Wallet
   ```
3. **Install dependencies:**
   ```bash
   npm install
   cd contract && cargo build
   ```
4. **Create a feature branch** (see [Branching Strategy](./branching-strategy.md)):
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## Types of Contributions

| Type | Examples |
|---|---|
| Bug fixes | Fix an error in address validation, fix a contract edge case |
| Features | Add a new campaign stat, improve the WebGL effect |
| Documentation | Fix typos, add examples, improve clarity |
| Tests | Add Jest tests for new helpers, add Rust tests for edge cases |
| UI/UX | Improve responsive layout, add animations |

---

## Development Workflow

1. Make your changes.
2. Run all tests:
   ```bash
   # Frontend tests
   CI=true npm test

   # Contract tests
   cd contract && cargo test
   ```
3. Ensure the build passes:
   ```bash
   npm run build
   ```
4. Commit with a clear message (see [Code Style](./code-style.md)):
   ```bash
   git commit -m "feat: add donation progress animation"
   ```
5. Push to your fork and open a **Pull Request** against `main`.

---

## Pull Request Guidelines

- Title should follow the commit message format: `type: brief description`
- Include a description of **what** changed and **why**
- Reference any related issues: `Closes #42`
- Ensure CI passes (GitHub Actions must be green)
- Keep PRs focused — one feature or fix per PR

---

## Reporting Issues

Use [GitHub Issues](https://github.com/amankoli09/Stellar-Connect-Wallet/issues) to:
- Report bugs (include steps to reproduce, expected vs. actual behaviour)
- Suggest features (explain the use case and benefit)

---

## Code of Conduct

Be respectful, constructive, and collaborative. This is an open-source project built for the Stellar developer community.

---

## License

By contributing you agree that your contributions are licensed under the **MIT License**.
