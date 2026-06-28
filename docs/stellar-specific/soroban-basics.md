# Soroban Basics

A concise primer on Soroban — Stellar's smart-contract platform — targeted at readers new to the ecosystem.

---

## What is Soroban?

Soroban is Stellar's smart-contract platform. Contracts are written in **Rust**, compiled to **WebAssembly (WASM)**, and executed by the Soroban host within Stellar Core. Soroban was introduced in Protocol 20 and is now available on both Testnet and Mainnet.

---

## Key Concepts

### Contract Macros

Soroban contracts use Rust procedural macros to declare their interface:

| Macro | Purpose |
|---|---|
| `#[contract]` | Marks a struct as a Soroban contract |
| `#[contractimpl]` | Marks an `impl` block as contract methods |
| `#[contracttype]` | Derives XDR serialisation for custom types |
| `#[contracterror]` | Defines a typed error enum |
| `#[contractevent]` | Defines a typed event struct |
| `#[contractclient]` | Generates a typed client for cross-contract calls |

---

### The `Env` Object

Every contract function receives an `env: Env` parameter. `Env` is the gateway to all Soroban host functionality:

```rust
pub fn donate(env: Env, from: Address, amount: i128) -> Result<i128, FundError> {
    env.storage().instance().get(&DataKey::Owner)  // storage
    env.current_contract_address()                  // self-address
    env.events().publish(...)                       // events
}
```

---

### Storage Tiers

| Tier | API | Lifetime |
|---|---|---|
| Instance | `env.storage().instance()` | Lives with the contract |
| Persistent | `env.storage().persistent()` | Survives archival if rent paid |
| Temporary | `env.storage().temporary()` | Auto-deleted after TTL |

---

### Authorization

`address.require_auth()` ensures that the transaction carries a valid signature (or contract invocation auth) for that address. It integrates with Stellar's auth framework and supports multi-sig accounts natively.

```rust
from.require_auth();  // transaction must be signed by `from`
owner.require_auth(); // only the owner address can proceed
```

---

### Invoking a Contract from the Frontend

```js
import { Contract, SorobanRpc, TransactionBuilder, nativeToScVal } from "@stellar/stellar-sdk";

const contract = new Contract(FUND_CONTRACT_ID);
const op = contract.call("donate", ...[fromVal, amountVal]);
const tx = new TransactionBuilder(account, { fee: baseFee, networkPassphrase })
  .addOperation(op)
  .setTimeout(30)
  .build();

const simResult = await server.simulateTransaction(tx);
const preparedTx = SorobanRpc.assembleTransaction(tx, simResult);
const signedXdr = await signTransaction(preparedTx.toXDR(), { network: "TESTNET" });
await server.sendTransaction(Transaction.fromXDR(signedXdr, networkPassphrase));
```

---

### Rent and TTL

Soroban charges **rent** for ledger state. Every persistent and instance storage entry has a **TTL (Time-To-Live)**. Entries whose TTL expires are archived and can be restored for a fee. For Testnet projects, TTL is refreshed automatically by contract interactions, but on Mainnet you should call `extendContractInstanceAndCodeTtl()` periodically.

---

### Soroban vs. Ethereum/EVM

| Feature | Soroban | EVM |
|---|---|---|
| Language | Rust (compiled to WASM) | Solidity / Vyper |
| Storage billing | Rent-based per-entry | Gas per write |
| Auth model | `require_auth()` per address | `msg.sender` |
| Token standard | SAC (Stellar Asset Contract) | ERC-20 |
| Events | `#[contractevent]` | `emit Event(...)` |

---

## Further Reading

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Soroban SDK Reference](https://docs.rs/soroban-sdk/latest/soroban_sdk/)
- [Stellar Developer Discord](https://discord.gg/stellardev)
