# RPC Configuration

The Soroban RPC is the JSON-RPC endpoint used to simulate and submit Soroban smart contract transactions.

---

## Testnet RPC Endpoint

```
https://soroban-testnet.stellar.org
```

---

## Configuring the SDK

```js
import { SorobanRpc } from "@stellar/stellar-sdk";

const server = new SorobanRpc.Server(
  process.env.REACT_APP_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org"
);
```

---

## Core RPC Methods Used

### `simulateTransaction(tx)`

Simulates a transaction without submitting it. Returns:
- The execution result
- Required auth entries
- Transaction footprint (ledger keys read/written)
- Recommended fee

```js
const simResult = await server.simulateTransaction(tx);
if (SorobanRpc.Api.isSimulationError(simResult)) {
  throw new Error(simResult.error);
}
const preparedTx = SorobanRpc.assembleTransaction(tx, simResult);
```

### `sendTransaction(signedTx)`

Submits a signed transaction:

```js
const sendResult = await server.sendTransaction(signedTx);
// sendResult.status: "PENDING" | "DUPLICATE" | "TRY_AGAIN_LATER" | "ERROR"
```

### `getTransaction(hash)`

Polls for the result of a submitted transaction:

```js
let result = await server.getTransaction(sendResult.hash);
while (result.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
  await sleep(1000);
  result = await server.getTransaction(sendResult.hash);
}
// result.status: "SUCCESS" | "FAILED"
```

### `getEvents(filter)`

Queries on-chain contract events:

```js
const { events } = await server.getEvents({
  startLedger: latestLedger,
  filters: [{ type: "contract", contractIds: [FUND_CONTRACT_ID] }],
});
```

### `getLatestLedger()`

Returns the current ledger info — needed as a starting point for event queries:

```js
const { sequence } = await server.getLatestLedger();
```

---

## Error Handling

| RPC Error | Meaning |
|---|---|
| `sendTransaction` → `ERROR` | Transaction rejected at the protocol level |
| `simulateTransaction` returns error | Contract panicked or auth failed during simulation |
| Network timeout | RPC endpoint unreachable — retry with backoff |

---

## Alternative RPC Providers

For production use, consider dedicated RPC providers for improved reliability:
- **MystellarTools** — community Soroban RPC
- **Blockdaemon** — enterprise Stellar node services
- **Self-hosted** — run your own Stellar Core + Soroban RPC node

---

## Mainnet RPC

```
https://soroban-mainnet.stellar.org
```

Update `REACT_APP_SOROBAN_RPC_URL` and the network passphrase — see [Testnet vs Mainnet](./testnet-vs-mainnet.md).
