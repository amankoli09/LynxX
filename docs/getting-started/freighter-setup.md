# Freighter Setup

Freighter is the official Stellar browser-extension wallet used by StellarFlow. This guide walks you through installing and configuring it.

---

## 1. Install Freighter

| Browser | Link |
|---|---|
| Chrome / Brave | [Chrome Web Store](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/freighter) |

After installing, pin the extension to your browser toolbar for easy access.

---

## 2. Create or Import a Wallet

1. Click the **Freighter** icon in your toolbar.
2. Choose **Create new wallet** (generates a fresh Stellar keypair) or **Import wallet** (enter your existing mnemonic).
3. Set a strong password and save your **recovery phrase** in a safe, offline location.

> ⚠️ **Never share your recovery phrase.** StellarFlow is non-custodial — it cannot access your keys and will never ask for your seed phrase.

---

## 3. Switch to Testnet

By default Freighter connects to **Mainnet**. For this project you must switch to **Testnet**:

1. Open Freighter → click the **⚙ Settings** gear icon.
2. Navigate to **Network**.
3. Select **Test SDF Network ; September 2015** (Testnet).
4. Click **Save**.

You should now see your Testnet address (begins with `G`).

---

## 4. Fund Your Testnet Account (Friendbot)

Testnet accounts start with zero balance. Use the Stellar Friendbot to receive 10,000 XLM:

```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

Or open [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) and click **Get test network lumens**.

---

## 5. Connect Freighter to StellarFlow

1. Open the dApp at [https://localhost:3000](https://localhost:3000) (or the live URL).
2. Click the **Connect** button.
3. Freighter will prompt you to **allow access** — click **Approve**.
4. Your public key and XLM balance appear on the dashboard immediately.

---

## How StellarFlow Uses Freighter

StellarFlow uses the `@stellar/freighter-api` library. The three core calls are:

| API Call | Purpose |
|---|---|
| `setAllowed()` | Requests permission from the user to use Freighter (one-time prompt) |
| `requestAccess()` | Returns the connected public key (`G...` address) |
| `signTransaction(xdr, opts)` | Opens Freighter for the user to review and sign a transaction in XDR format |

> **Private keys never leave Freighter.** The dApp only receives the signed XDR blob, never the raw keypair.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Freighter not detected" | Install/enable the extension and refresh the page |
| Connect button does nothing | Check that the page is served over HTTPS (`npm start` uses `HTTPS=true`) |
| Wrong network | Ensure Freighter is set to Testnet (Step 3) |
| Zero balance after connect | Fund the account via Friendbot (Step 4) |
| Signing popup doesn't appear | Make sure you're on the Testnet network in both Freighter and the dApp |
