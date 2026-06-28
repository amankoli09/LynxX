# SAC Tokens (Stellar Asset Contracts)

SAC (Stellar Asset Contract) is the standard Soroban interface that wraps any Stellar classic asset into a smart-contract-callable token.

---

## What is a SAC?

A SAC is a pre-deployed Soroban contract that implements the standard token interface for a Stellar classic asset (like the native XLM or any issued asset). It allows Soroban contracts to interact with Stellar assets using the familiar `transfer`, `balance`, `allowance` interface.

---

## Native XLM SAC

StellarFund uses the **native XLM SAC** as its accepted token:

```
Token ID (Testnet): CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

This is the pre-deployed SAC that wraps the native Lumens (XLM) asset on Testnet.

---

## How the SAC is Used in the Fund Contract

The contract stores the SAC address as `Token` and uses the Soroban-generated token client to transfer assets:

```rust
use soroban_sdk::token::Client as TokenClient;

let token_client = TokenClient::new(&env, &token_address);

// Pull amount from donor into contract
token_client.transfer(&from, &env.current_contract_address(), &amount);

// Push total balance to owner on withdraw
let balance = token_client.balance(&env.current_contract_address());
token_client.transfer(&env.current_contract_address(), &owner, &balance);
```

---

## SAC Token Interface (Relevant Methods)

| Method | Description |
|---|---|
| `transfer(from, to, amount)` | Transfer `amount` from `from` to `to` (requires `from` auth) |
| `balance(address)` | Returns the balance of `address` in stroops |
| `allowance(from, spender)` | Returns how much `spender` can transfer on behalf of `from` |
| `approve(from, spender, amount, expiry)` | Grants allowance |

---

## SAC vs. Custom Token

| Feature | Native XLM SAC | Custom SAC | ERC-20-like |
|---|---|---|---|
| Pre-deployed | ✅ (by SDF) | ✅ (by asset issuer) | ❌ (deploy yourself) |
| Backed by real asset | ✅ | ✅ | Depends |
| Standard interface | ✅ | ✅ | Varies |
| Mainnet support | ✅ | ✅ | N/A |

---

## Finding SAC Addresses

To get the SAC address for an asset:

```bash
# For native XLM:
stellar contract id asset --asset native --network testnet

# For any issued asset (e.g. USDC):
stellar contract id asset --asset USDC:ISSUER_ADDRESS --network testnet
```

Or use [Stellar Laboratory](https://laboratory.stellar.org) → Contract ID → Asset.

---

## Related Docs

- [Fund Contract →](../smart-contracts/fund-contract.md)
- [Stroop ↔ XLM Conversion →](./stroop-xlm-conversion.md)
