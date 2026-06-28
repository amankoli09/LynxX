# On-Chain Event Tracking

This page explains how to track and index on-chain events from the StellarFund contract for monitoring and analytics purposes.

---

## Available Events

| Contract | Event | Topic | Fields |
|---|---|---|---|
| `fund` | `Donated` | `["Donated"]` | `from, amount, total` |
| `fund` | `Withdrawn` | `["Withdrawn"]` | `owner, amount` |

---

## Querying Events via Soroban RPC

```js
const { events } = await server.getEvents({
  startLedger: startLedger,
  filters: [
    {
      type: "contract",
      contractIds: [FUND_CONTRACT_ID],
      // No topic filter = all events from this contract
    },
  ],
  limit: 100,
});
```

Each event object:
```json
{
  "id": "0000000012345-000000001",
  "ledger": 12345,
  "ledgerClosedAt": "2024-01-01T00:00:00Z",
  "contractId": "CCIYIE...",
  "topic": ["AAAADgAAAAhEb25hdGVk...", "..."],
  "value": "AAAA...",
  "inSuccessfulContractCall": true
}
```

---

## Campaign Progress Monitoring

To track campaign progress without reading contract state:

1. Start from the deployment ledger.
2. Accumulate `amount` from all `Donated` events → equals `raised`.
3. Count unique `from` addresses → equals `donors`.
4. If any `Withdrawn` event exists → campaign has been funded and withdrawn.

---

## Building an Event Index

For production monitoring, build a simple event indexer:

```js
async function buildCampaignIndex(server, contractId, fromLedger) {
  const index = { raised: BigInt(0), donors: new Set(), events: [] };

  let ledger = fromLedger;
  while (true) {
    const { events, latestLedger } = await server.getEvents({
      startLedger: ledger,
      filters: [{ type: "contract", contractIds: [contractId] }],
    });

    for (const event of events) {
      const data = scValToNative(event.value);
      index.raised += BigInt(data.amount);
      index.donors.add(data.from.toString());
      index.events.push({ ledger: event.ledger, ...data });
    }

    if (ledger >= latestLedger.sequence) break;
    ledger = latestLedger.sequence;
  }

  return {
    raised: fromStroops(index.raised),
    donorCount: index.donors.size,
    events: index.events,
  };
}
```

---

## Stellar Expert Explorer

All events are publicly viewable on [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI):
- Navigate to the contract page.
- Click the **Events** tab.
- Filter by topic to view `Donated` or `Withdrawn` events.

---

## Related Docs

- [Contract Events →](../smart-contracts/events.md)
- [Event Streaming →](./event-streaming.md)
- [Logging Strategy →](./logging-strategy.md)
