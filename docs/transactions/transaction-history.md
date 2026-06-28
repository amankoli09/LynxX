# Transaction History

StellarFlow maintains a persistent transaction history displayed in the "Recent Activity" panel on the dashboard.

---

## How History is Stored

Transaction records are saved to **browser `localStorage`** under the key `stellarflow_txHistory`. They persist across page reloads and wallet disconnects, but are **browser-local** (not synced across devices or browsers).

---

## Data Structure

Each history entry is a JSON object:

```json
{
  "hash": "5edecdcbbc74588796b951900b22244af71baa35398e2aa499d32645511937e4",
  "to": "GABC...WXYZ",
  "amount": "10.0000000",
  "timestamp": 1720000000000,
  "status": "confirmed",
  "type": "send"
}
```

| Field | Type | Description |
|---|---|---|
| `hash` | `string` | Stellar transaction hash (64-char hex) |
| `to` | `string` | Recipient Stellar address |
| `amount` | `string` | XLM amount with 7 decimal places |
| `timestamp` | `number` | Unix timestamp (ms) of local record creation |
| `status` | `string` | `"confirmed"` \| `"failed"` |
| `type` | `string` | `"send"` \| `"donate"` |

---

## Appending a New Entry

```js
function addToHistory(entry) {
  setTxHistory(prev => {
    const updated = [entry, ...prev].slice(0, 50); // Keep last 50 entries
    localStorage.setItem("stellarflow_txHistory", JSON.stringify(updated));
    return updated;
  });
}
```

---

## Displaying History

The Recent Activity panel renders history entries in reverse-chronological order:

```jsx
{txHistory.map(tx => (
  <div key={tx.hash} className="tx-entry">
    <span className="tx-icon">{tx.type === "send" ? "↑" : "♥"}</span>
    <span className="tx-to">{shortAddress(tx.to)}</span>
    <span className="tx-amount">-{parseFloat(tx.amount).toFixed(2)} XLM</span>
    <a
      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View ↗
    </a>
    <span className="tx-time">{new Date(tx.timestamp).toLocaleString()}</span>
  </div>
))}
```

---

## Clearing History

The user can clear their local history from the UI. This removes the `localStorage` entry:

```js
function clearHistory() {
  setTxHistory([]);
  localStorage.removeItem("stellarflow_txHistory");
}
```

---

## On-Chain History

For a full on-chain history, use the Stellar Explorer or query Horizon directly:

```
https://stellar.expert/explorer/testnet/account/{address}
```

```
GET https://horizon-testnet.stellar.org/accounts/{address}/transactions?order=desc&limit=20
```
