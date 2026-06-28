# Event Streaming

This page explains how StellarFlow streams on-chain events from the `fund` contract to power the live activity feed.

---

## What Events are Streamed

The `fund` contract emits `Donated { from, amount, total }` events on every successful donation. StellarFlow polls these events to display a real-time activity feed.

---

## Polling via Soroban RPC

The Soroban RPC `getEvents` method is the recommended way to query Soroban contract events:

```js
import { SorobanRpc } from "@stellar/stellar-sdk";

const server = new SorobanRpc.Server(SOROBAN_RPC_URL);

async function getRecentDonations(contractId, limit = 10) {
  const { sequence: latestLedger } = await server.getLatestLedger();

  const { events } = await server.getEvents({
    startLedger: latestLedger - 1000, // Look back ~1000 ledgers (~83 mins)
    filters: [
      {
        type: "contract",
        contractIds: [contractId],
        topics: [["Donated"]], // Filter by event topic
      },
    ],
  });

  return events
    .map(decodeEvent)
    .slice(-limit)
    .reverse(); // Most recent first
}
```

---

## Decoding Event Data

```js
import { scValToNative } from "@stellar/stellar-sdk";

function decodeEvent(event) {
  const value = scValToNative(event.value);
  return {
    ledger: event.ledger,
    from: value.from.toString(),
    amount: value.amount,
    total: value.total,
    timestamp: new Date(event.ledgerClosedAt).getTime(),
  };
}
```

---

## Polling Frequency

StellarFlow polls for new events:
- On component mount (initial load)
- After each confirmed donation
- Not on a timer (no real-time WebSocket subscription)

For true real-time streaming, Horizon Server-Sent Events (SSE) can be used:

```js
const es = server.effects().forAccount(contractId).stream({
  onmessage: (effect) => {
    if (effect.type === "contract_debited") {
      refreshActivityFeed();
    }
  },
});
// Remember to close: es()
```

---

## Activity Feed Display

```jsx
{donations.map((d, i) => (
  <div key={i} className="activity-item">
    <span className="activity-icon">♥</span>
    <span className="activity-from">{shortAddress(d.from)}</span>
    <span className="activity-amount">+{fromStroops(d.amount).toFixed(2)} XLM</span>
    <span className="activity-total">Total: {fromStroops(d.total).toFixed(0)} XLM</span>
  </div>
))}
```

---

## Related Docs

- [Contract Events →](../smart-contracts/events.md)
- [On-Chain Event Tracking →](./on-chain-event-tracking.md)
- [RPC Configuration →](../stellar-specific/rpc-configuration.md)
