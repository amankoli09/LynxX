# Donor Journey

This document maps the complete end-to-end experience for a donor interacting with StellarFund for the first time.

---

## Step 1 — Discover the dApp

1. Donor visits [https://stellar-connect-wallet-rr5q.vercel.app/](https://stellar-connect-wallet-rr5q.vercel.app/).
2. Sees the WebGL light-rays landing page with the project hero.
3. Reads the campaign description and current progress (% funded, donor count).

---

## Step 2 — Install Freighter

If the donor doesn't have Freighter:
1. Click the **Install Freighter** link (or visit [freighter.app](https://www.freighter.app)).
2. Install the browser extension for Chrome or Brave.
3. Create a new wallet (save recovery phrase offline).
4. Switch Freighter to **Testnet** (Settings → Network).

---

## Step 3 — Fund the Testnet Wallet

```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

The account receives 10,000 test XLM.

---

## Step 4 — Connect Wallet

1. Click **Connect** on the dApp.
2. Freighter prompts to approve access — click **Approve**.
3. Dashboard loads showing the public key and XLM balance.

---

## Step 5 — Navigate to Campaign

1. Click **Campaign** in the dashboard navigation.
2. `Crowdfund.js` loads and displays:
   - Campaign goal (1,000 XLM)
   - Amount raised so far
   - Number of unique donors
   - Progress bar
   - Live activity feed (recent donations)

---

## Step 6 — Make a Donation

1. Enter a donation amount (e.g., 10 XLM).
2. Click **Donate**.
3. The dApp simulates the transaction and presents it to Freighter.
4. Freighter shows the signing popup:
   - Contract invocation details
   - Fee (small amount of XLM)
5. Donor clicks **Approve**.
6. Transaction is submitted and confirmed in ~3–5 seconds.

---

## Step 7 — Badge Awarded

After confirmation:
1. The fund contract cross-calls the badge contract.
2. Donor's badge tier is updated:
   - 🥉 Bronze (any donation)
   - 🥈 Silver (≥ 10 XLM cumulative)
   - 🥇 Gold (≥ 100 XLM cumulative)
3. Dashboard updates to show the new badge tier.

---

## Step 8 — View Transaction

1. A green "Donation confirmed!" badge appears with the transaction hash.
2. Click **View on Explorer ↗** to see the transaction on Stellar Expert.
3. The donation appears in the Recent Activity feed.

---

## Repeat Donors

On subsequent donations:
- The wallet is already connected — no re-approval needed.
- Cumulative contribution is tracked on-chain.
- Badge tier upgrades automatically when thresholds are crossed.

---

## Related Docs

- [Send XLM Flow →](../transactions/send-xlm-flow.md)
- [Badge Contract →](../smart-contracts/badge-contract.md)
- [Badge Tier Progression →](./badge-tier-progression.md)
