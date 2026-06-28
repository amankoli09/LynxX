# Frontend Architecture

StellarFlow is a **React 18/19** single-page application bootstrapped with **Create React App**. It follows a flat component model — there is no Redux or Context API; state is co-located in the component that owns it.

---

## Project Structure

```
src/
├── components/
│   ├── Header.js       # Landing page + dashboard shell
│   ├── Freighter.js    # Wallet connectivity (connect / balance / sign)
│   ├── Fund.js         # Soroban RPC client + campaign reads
│   ├── Crowdfund.js    # Campaign donation UI with state machine
│   ├── LightRays.js    # WebGL hero (OGL + GLSL)
│   ├── LightRays.css
│   ├── MagicRings.js   # Secondary WebGL animation
│   ├── MagicRings.css
│   ├── Counter.js      # Animated numeric counter
│   ├── FAQ.js          # Collapsible FAQ panel
│   ├── Reveal.js       # Scroll-triggered reveal animation
│   ├── Roadmap.js      # Project roadmap section
│   ├── Terminal.js     # Animated terminal / code display
│   ├── Testimonials.js # Social proof section
│   └── Contracts.js    # On-chain contract info display
├── lib/
│   ├── stellar.js      # Pure helpers (no network / no DOM)
│   └── stellar.test.js # 9 Jest unit tests
├── App.js              # Root component — renders Header
├── App.css             # Full design system (glassmorphism dark theme)
├── index.css           # CSS reset / globals
└── index.js            # React DOM entry point
```

---

## Component Breakdown

### `Header.js`
The largest component (~1,000 lines). Owns the top-level application state:
- Wallet connection state (`walletAddress`, `balance`, `isConnected`)
- Active panel navigation
- XLM send form state
- Transaction history array (persisted to `localStorage`)

Renders the landing hero, navigation, and dashboard grid conditionally based on `isConnected`.

### `Freighter.js`
Encapsulates all Freighter API interactions:
- `setAllowed()` → requests dApp permission
- `requestAccess()` → retrieves the connected public key
- `signTransaction(xdr, { network })` → opens Freighter signing popup
- Horizon REST call → fetches live XLM balance

Props passed up to `Header.js` via callbacks.

### `Fund.js`
Soroban RPC client. Builds, simulates, and submits `donate()` transactions. Also reads campaign state:
- `raised()` — total XLM raised (in stroops)
- `donors()` — unique donor count
- `goal()` — fundraising goal
- `is_closed()` — whether the campaign has ended
- `getRecentDonations()` — streams `Donated` events via Horizon

### `Crowdfund.js`
A self-contained campaign panel with a four-stage state machine: `idle → pending → success → error`. Displays real-time campaign progress bar and calls into `Fund.js`.

### `LightRays.js`
An interactive WebGL background rendered via the `ogl` library. Uses custom GLSL fragment/vertex shaders to draw mouse-reactive light beams on a canvas element.

### `lib/stellar.js`
Pure, dependency-free utility functions:
- `toStroops(xlm)` — converts XLM to BigInt stroops
- `fromStroops(stroops)` — converts stroops to XLM Number
- `isValidStellarAddress(address)` — regex-based format check (`G` + 55 base-32 chars)
- `tierName(tier)` — maps badge tier number (1/2/3) to Bronze/Silver/Gold
- `shortAddress(address)` — truncates `GABC…WXYZ`

These are the only functions covered by automated Jest tests.

---

## State Management Pattern

There is no global state manager. State is lifted to the lowest common ancestor that needs it:

```
Header.js  (owns: walletAddress, balance, txHistory, sendForm)
├── Freighter.js  (local: loading, error)
├── Crowdfund.js  (local: idle/pending/success/error)
│   └── Fund.js   (local: rpc calls, campaign data)
└── LightRays.js  (local: WebGL canvas refs)
```

`localStorage` is used for cross-session persistence of transaction history only.

---

## CSS Design System

All styles live in `App.css` using vanilla CSS. The design system uses:
- **CSS custom properties** for colours and spacing tokens
- **Glassmorphism** — `backdrop-filter: blur()` + `rgba` overlays
- **Dark theme** — deep navy/space backgrounds with luminous accent colours
- **Micro-animations** — keyframe animations for counters, reveals, and WebGL transitions

See [Styling & Design System](../frontend/styling-design-system.md) for the full token reference.
