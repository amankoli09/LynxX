# lynxx-wallet-sdk

> Non-custodial Stellar wallet integration SDK for dApps built on Soroban.

[![npm version](https://img.shields.io/npm/v/lynxx-wallet-sdk.svg)](https://www.npmjs.com/package/lynxx-wallet-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

---

## Installation

```bash
npm install lynxx-wallet-sdk
```

---

## Quick Start

```ts
import { initLynxx } from 'lynxx-wallet-sdk';

const wallet = initLynxx();

// Connect to Freighter wallet
await wallet.connect();
```

---

## API

### `initLynxx()`

Returns a new `LynxxWalletProvider` instance. This is the primary entry point for dApps integrating the SDK.

```ts
import { initLynxx } from 'lynxx-wallet-sdk';

const wallet = initLynxx();
```

### `LynxxWalletProvider`

The core provider class for managing wallet connections on the Stellar network.

| Method | Returns | Description |
|--------|---------|-------------|
| `connect()` | `Promise<void>` | Connects to the user's Freighter wallet |

### `LynxxConfig`

TypeScript interface for SDK configuration.

```ts
interface LynxxConfig {
  network: string; // e.g. 'testnet' or 'mainnet'
}
```

---

## Requirements

- [`@stellar/stellar-sdk`](https://www.npmjs.com/package/@stellar/stellar-sdk) >= 10.0.0 (peer dependency)
- [Freighter Wallet](https://freighter.app/) browser extension

---

## Part of LynxX

This SDK is part of the [LynxX](https://github.com/amankoli09/LynxX) open-source crowdfunding dApp built on Stellar Soroban.

- 🌐 [GitHub Repository](https://github.com/amankoli09/LynxX)
- 📦 [npm Package](https://www.npmjs.com/package/lynxx-wallet-sdk)
- 📄 [Changelog](../../CHANGELOG.md)

---

## License

MIT © [Aman Koli](https://github.com/amankoli09)
