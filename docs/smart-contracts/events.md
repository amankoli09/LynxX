# Contract Events

Both `fund` and `badge` contracts emit on-chain events using Soroban's `#[contractevent]` macro. These events can be streamed from Horizon or the Soroban RPC endpoint.

---

## `fund` Contract Events

### `Donated`

Emitted by `donate()` on every successful donation.

```rust
#[contractevent]
pub struct Donated {
    pub from:   Address,
    pub amount: i128,
    pub total:  i128,
}
```

| Field | Type | Description |
|---|---|---|
| `from` | `Address` | The donor's Stellar address |
| `amount` | `i128` | Amount donated in this transaction (stroops) |
| `total` | `i128` | New cumulative amount raised across all donors (stroops) |

---

### `Withdrawn`

Emitted by `withdraw()` when the owner withdraws the campaign balance.

```rust
#[contractevent]
pub struct Withdrawn {
    pub owner:  Address,
    pub amount: i128,
}
```

| Field | Type | Description |
|---|---|---|
| `owner` | `Address` | The beneficiary address |
| `amount` | `i128` | Total amount withdrawn (stroops) |

---

## Reading Events via Soroban RPC

Use `getEvents` on the Soroban RPC to subscribe to contract events:

```js
const { events } = await server.getEvents({
  startLedger: latestLedger,
  filters: [
    {
      type: "contract",
      contractIds: [FUND_CONTRACT_ID],
      topics: [["Donated"]],
    },
  ],
});
```

Each event has:
- `id` — unique event identifier
- `ledger` — ledger sequence where the event was emitted
- `contractId` — the emitting contract
- `topics` — array of topic symbols (event name + additional filters)
- `value` — XDR-encoded event data (decoded by `stellar-sdk`)

---

## Reading Events via Horizon

Horizon indexes Soroban events as `contract_debited` / `contract_credited` effects. For fine-grained event filtering, the Soroban RPC `getEvents` endpoint is preferred.

```
GET https://horizon-testnet.stellar.org/accounts/{CONTRACT_ID}/effects
```

---

## Live Activity Feed

The `getRecentDonations()` function in `Fund.js` queries recent `Donated` events and returns them as an array for display in the dashboard activity panel:

```js
async function getRecentDonations(server, contractId, limit = 10) {
  const events = await server.getEvents({
    startLedger: recentLedger,
    filters: [{ type: "contract", contractIds: [contractId], topics: [["Donated"]] }],
  });
  return events.events
    .map(e => decodeEvent(e))
    .slice(-limit)
    .reverse(); // most recent first
}
```

---

## Event Indexing for Monitoring

For production deployments, consider indexing events in a dedicated event processor. See [On-Chain Event Tracking](../monitoring-logging/on-chain-event-tracking.md) for details.
