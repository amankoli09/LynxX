# Frontend Deployment — Vercel

StellarFlow is deployed as a static React SPA on **Vercel**. Vercel provides automatic deployments on every push to `main`.

---

## Live URL

> **[https://stellar-connect-wallet-rr5q.vercel.app/](https://stellar-connect-wallet-rr5q.vercel.app/)**

---

## Initial Setup

### 1. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Select **Import from GitHub** → choose `Stellar-Connect-Wallet`.
3. Set **Framework Preset** to `Create React App`.
4. Click **Deploy**.

---

### 2. Configure Environment Variables

In Vercel Dashboard → Project → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `REACT_APP_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` |
| `REACT_APP_HORIZON_URL` | `https://horizon-testnet.stellar.org` |
| `REACT_APP_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` |
| `REACT_APP_FUND_CONTRACT_ID` | Your deployed fund contract ID |
| `REACT_APP_TOKEN_ID` | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |

---

### 3. SPA Routing — `vercel.json`

The project includes a `vercel.json` that rewrites all paths to `index.html` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without this, direct URL navigation (e.g., `/dashboard`) returns a 404.

---

## Automatic Deployments

After the initial setup:
- Every push to `main` triggers a new Vercel deployment.
- Pull requests get **preview deployments** with unique URLs.
- Deployment logs are visible in the Vercel dashboard.

---

## Manual Deploy

To trigger a manual deployment from the CLI:

```bash
npm install -g vercel
vercel --prod
```

---

## Custom Domain (Optional)

1. Vercel Dashboard → Project → **Settings → Domains**.
2. Add your domain.
3. Configure DNS (CNAME or A record) as instructed by Vercel.

---

## Build Command

Vercel runs:
```
npm run build
```

Output directory: `build/`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| 404 on direct URL | Ensure `vercel.json` with rewrites is present |
| Blank page after deploy | Check browser console — likely missing env variable |
| Env vars not applied | Redeploy after adding env vars in Vercel dashboard |
| Build fails | Check Vercel build logs for missing dependencies or env vars |
