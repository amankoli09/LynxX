# Balance Fetching

StellarFlow displays the connected wallet's live XLM balance by querying the Stellar Horizon API.

---

## How Balance is Fetched

The balance is fetched via a simple Horizon REST call to the `/accounts/{address}` endpoint:

```js
async function fetchBalance(address) {
  const HORIZON_URL = process.env.REACT_APP_HORIZON_URL
    || "https://horizon-testnet.stellar.org";

  const response = await fetch(`${HORIZON_URL}/accounts/${address}`);

  if (!response.ok) {
    if (response.status === 404) {
      return "0"; // Account not yet funded (unfunded accounts don't exist on-chain)
    }
    throw new Error(`Horizon error: ${response.status}`);
  }

  const data = await response.json();

  // Find the native XLM balance entry
  const nativeBalance = data.balances.find(b => b.asset_type === "native");
  return nativeBalance?.balance ?? "0";
}
```

---

## Horizon Balance Response

```json
{
  "balances": [
    {
      "balance": "9750.0000000",
      "asset_type": "native"
    }
  ]
}
```

The `balance` field is a **string** representing XLM with 7 decimal places. StellarFlow displays this directly (e.g. `9750.00 XLM`).

---

## When Balance is Refreshed

| Trigger | Action |
|---|---|
| Wallet connects | Fetch balance immediately |
| Transaction confirmed | Fetch balance (auto-refresh) |
| Manual refresh button | Fetch balance on click |

---

## Auto-Refresh After Transactions

After a transaction is confirmed, the balance is automatically refreshed:

```js
async function handleTransactionSuccess(txHash) {
  setTransactionStatus("success");
  setLastTxHash(txHash);

  // Refresh balance
  const newBalance = await fetchBalance(walletAddress);
  setBalance(newBalance);
}
```

---

## Displaying the Balance

```jsx
<div className="balance-display">
  <span className="balance-amount">
    {parseFloat(balance).toFixed(2)}
  </span>
  <span className="balance-unit">XLM</span>
</div>
```

---

## Unfunded Accounts

If a Testnet wallet has never been funded (via Friendbot), Horizon returns a **404** — the account doesn't exist on the ledger yet. StellarFlow handles this gracefully by showing `0.00 XLM` rather than an error.

---

## Related Docs

- [Connect Flow →](./connect-flow.md)
- [Horizon API →](../stellar-specific/horizon-api.md)
- [Freighter Setup →](../getting-started/freighter-setup.md)
