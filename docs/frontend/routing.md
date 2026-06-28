# Routing

StellarFlow is a single-page application (SPA) with no multi-page routing. Navigation between views is handled via component-level state rather than a router library.

---

## Navigation Model

There is no React Router. Instead, `Header.js` tracks the `activePanel` state and conditionally renders the appropriate view:

```js
const [activePanel, setActivePanel] = useState("landing");
// Values: "landing" | "dashboard" | "send" | "crowdfund" | "history"
```

```jsx
{!isConnected && <LandingView />}
{isConnected && activePanel === "dashboard" && <DashboardView />}
{isConnected && activePanel === "send" && <SendPanel />}
{isConnected && activePanel === "crowdfund" && <Crowdfund />}
{isConnected && activePanel === "history" && <HistoryPanel />}
```

---

## Navigation Buttons

Navigation buttons in the dashboard header update `activePanel`:

```jsx
<nav className="dashboard-nav">
  <button onClick={() => setActivePanel("dashboard")} className={activePanel === "dashboard" ? "active" : ""}>
    Overview
  </button>
  <button onClick={() => setActivePanel("send")} className={activePanel === "send" ? "active" : ""}>
    Send XLM
  </button>
  <button onClick={() => setActivePanel("crowdfund")} className={activePanel === "crowdfund" ? "active" : ""}>
    Campaign
  </button>
  <button onClick={() => setActivePanel("history")} className={activePanel === "history" ? "active" : ""}>
    History
  </button>
</nav>
```

---

## Vercel SPA Configuration

Since there is no server-side routing, all URL paths must serve `index.html`. This is configured in `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without this, direct URL visits (e.g. `/dashboard`) would return a 404 from Vercel.

---

## Why No React Router?

- The app has 4–5 views that are all conditionally rendered on the same page.
- There is no need for browser history navigation (back/forward) between wallet states.
- A router would add complexity and dependency without user-visible benefit for this app's scope.

**If the app grows:** introducing `react-router-dom` for `/send`, `/campaign`, `/history` routes would be the natural next step and would enable browser back-button navigation and shareable deep links.

---

## Landing vs. Dashboard

The key navigation split is whether the wallet is connected:

```
isConnected = false → Landing page (WebGL hero, FAQ, features)
isConnected = true  → Dashboard (balance, send panel, campaign, history)
```

This transition happens in `Header.js` when `onConnect()` is called from `Freighter.js`.
