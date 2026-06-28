# Component Overview

StellarFlow's React front-end is composed of focused, single-responsibility components. This page provides a high-level map of every component and its role.

---

## Component Map

```
App.js
└── Header.js           ← root shell (owns top-level state)
    ├── LightRays.js    ← WebGL landing hero
    ├── MagicRings.js   ← WebGL animation (secondary)
    ├── Counter.js      ← Animated number counter
    ├── Reveal.js       ← Scroll-triggered reveal wrapper
    ├── Terminal.js     ← Animated terminal display
    ├── Testimonials.js ← Social proof section
    ├── Roadmap.js      ← Project roadmap
    ├── FAQ.js          ← Collapsible FAQ panel
    ├── Contracts.js    ← On-chain contract info
    ├── Freighter.js    ← Wallet connect / balance / signing
    ├── Fund.js         ← Soroban RPC client
    └── Crowdfund.js    ← Campaign donation UI
```

---

## Component Reference

| Component | File | Size | Purpose |
|---|---|---|---|
| `Header` | `Header.js` | ~1,000 lines | Landing hero, dashboard shell, XLM send form, tx history |
| `Freighter` | `Freighter.js` | ~120 lines | Wallet connect, address, balance, sign |
| `Fund` | `Fund.js` | ~200 lines | Soroban RPC calls (donate, read campaign, events) |
| `Crowdfund` | `Crowdfund.js` | ~190 lines | Donation form with loading/error state machine |
| `LightRays` | `LightRays.js` | ~265 lines | WebGL light-rays hero with OGL + GLSL |
| `MagicRings` | `MagicRings.js` | ~200 lines | Secondary WebGL 3D ring animation |
| `Counter` | `Counter.js` | ~35 lines | Smooth animated number counter |
| `Reveal` | `Reveal.js` | ~25 lines | Intersection Observer scroll-reveal wrapper |
| `Terminal` | `Terminal.js` | ~130 lines | Typewriter-style code/terminal animation |
| `FAQ` | `FAQ.js` | ~60 lines | Accordion FAQ with open/close state |
| `Testimonials` | `Testimonials.js` | ~40 lines | Static testimonial cards |
| `Roadmap` | `Roadmap.js` | ~40 lines | Static roadmap timeline |
| `Contracts` | `Contracts.js` | ~110 lines | On-chain contract IDs and explorer links |

---

## Key State Owners

| State | Owner | Passed To |
|---|---|---|
| `walletAddress` | `Header` | `Freighter`, `Fund`, `Crowdfund` |
| `balance` | `Header` | `Freighter` (display) |
| `isConnected` | `Header` | All panels (conditional render) |
| `txHistory` | `Header` | History panel (localStorage) |
| `sendForm` | `Header` | Send XLM form |
| `campaignData` | `Fund` (local) | `Crowdfund` |
| `donateState` | `Crowdfund` (local) | Internal |

---

## Related Docs

- [Frontend Architecture →](../architecture/frontend-architecture.md)
- [State Management →](./state-management.md)
- [WebGL Light Rays →](./webgl-light-rays.md)
