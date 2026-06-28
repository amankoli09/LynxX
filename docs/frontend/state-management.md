# State Management

StellarFlow uses a flat, prop-drilling state model — no Redux, no Context API. State is co-located with the component that owns it and passed down via props and callbacks.

---

## State Ownership

### `Header.js` — Top-Level State

`Header.js` is the root application component and owns all cross-component state:

```js
// Wallet state
const [walletAddress, setWalletAddress] = useState(null);
const [balance, setBalance] = useState("0");
const [isConnected, setIsConnected] = useState(false);

// UI state
const [activePanel, setActivePanel] = useState("dashboard");
const [walletError, setWalletError] = useState(null);

// Send form state
const [recipient, setRecipient] = useState("");
const [amount, setAmount] = useState("");
const [sendStatus, setSendStatus] = useState("idle"); // idle | pending | success | error
const [lastTxHash, setLastTxHash] = useState(null);

// Transaction history (persisted to localStorage)
const [txHistory, setTxHistory] = useState(() => {
  return JSON.parse(localStorage.getItem("stellarflow_txHistory") || "[]");
});
```

### `Crowdfund.js` — Campaign State

```js
const [donateStatus, setDonateStatus] = useState("idle"); // idle | pending | success | error
const [donateError, setDonateError] = useState(null);
const [campaign, setCampaign] = useState(null); // { raised, donors, goal, isClosed }
```

### `Freighter.js` — Connection State

```js
const [connecting, setConnecting] = useState(false);
const [connectError, setConnectError] = useState(null);
```

---

## Data Flow Pattern

```
Header.js (owns state)
    │
    ├── props ──▶ Freighter.js
    │              │ onConnect callback ──▶ sets walletAddress, balance
    │
    ├── props ──▶ Fund.js
    │              │ reads walletAddress to build transactions
    │
    └── props ──▶ Crowdfund.js
                   │ onDonate callback ──▶ refreshes campaign data
```

---

## localStorage Persistence

Transaction history is persisted across page reloads using `localStorage`:

```js
// Write on every new transaction
useEffect(() => {
  localStorage.setItem("stellarflow_txHistory", JSON.stringify(txHistory));
}, [txHistory]);

// Read on initial mount (lazy state initializer)
const [txHistory, setTxHistory] = useState(() => {
  return JSON.parse(localStorage.getItem("stellarflow_txHistory") || "[]");
});
```

---

## Why No Global State Manager?

- The component tree is shallow — `Header → child` is one or two levels deep.
- Wallet state only needs to be shared between 3–4 sibling components.
- Adding Redux or Context would increase boilerplate without benefit.
- If the app grows significantly, introducing React Context for `walletAddress` + `balance` would be the natural next step.

---

## State Reset on Disconnect

When the user "disconnects":

```js
function handleDisconnect() {
  setWalletAddress(null);
  setBalance("0");
  setIsConnected(false);
  setSendStatus("idle");
  setLastTxHash(null);
  // txHistory is preserved — survives disconnect
}
```
