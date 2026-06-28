# Horizon API

Horizon is Stellar's REST API gateway for querying the ledger. StellarFlow uses Horizon to fetch account balances and transaction history.

---

## Endpoints Used

### Account Details (Balance Fetch)

```
GET https://horizon-testnet.stellar.org/accounts/{address}
```

Returns the account object including all asset balances. StellarFlow reads the `native` balance to display XLM:

```js
const response = await fetch(
  `${HORIZON_URL}/accounts/${walletAddress}`
);
const data = await response.json();
const xlmBalance = data.balances.find(b => b.asset_type === "native")?.balance;
```

---

### Transaction History

```
GET https://horizon-testnet.stellar.org/accounts/{address}/transactions?order=desc&limit=10
```

Returns the 10 most recent transactions for an account.

---

### Effects (for monitoring)

```
GET https://horizon-testnet.stellar.org/accounts/{contract_id}/effects
```

Returns Horizon-indexed effects for the contract account — useful for a simple event feed.

---

## Using Horizon via `stellar-sdk`

The Stellar JS SDK provides a `Horizon.Server` class:

```js
import { Horizon } from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

// Fetch account
const account = await server.accounts().accountId(address).call();
const xlmBalance = account.balances.find(b => b.asset_type === "native")?.balance;

// Fetch transaction history
const txPage = await server.transactions()
  .forAccount(address)
  .order("desc")
  .limit(10)
  .call();
```

---

## Rate Limits

Horizon Testnet has generous rate limits for development. For production/Mainnet:
- Public Horizon: ~100 req/s per IP
- Authenticated (via Stellar API key): higher limits available

---

## Horizon vs. Soroban RPC

| Use Case | Use Horizon | Use Soroban RPC |
|---|---|---|
| Account balance | ✅ | ❌ |
| Transaction history | ✅ | ❌ |
| Invoke contract method | ❌ | ✅ |
| Simulate transaction | ❌ | ✅ |
| Submit signed transaction | Both work | ✅ preferred for Soroban |
| Read contract events | Limited | ✅ (`getEvents`) |

---

## Related Docs

- [RPC Configuration →](./rpc-configuration.md)
- [Balance Fetching →](../wallet-integration/balance-fetching.md)
