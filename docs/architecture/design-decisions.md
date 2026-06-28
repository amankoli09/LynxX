# Design Decisions

This document captures the key architectural decisions made during the development of StellarFund + StellarFlow, along with the rationale for each.

---

## 1. Two Cooperating Soroban Contracts Instead of One

**Decision:** Split crowdfunding (`fund`) and badge management (`badge`) into separate contracts that communicate via cross-contract calls.

**Rationale:**
- **Separation of concerns** — the badge contract can be upgraded or replaced independently of the fund contract without touching campaign logic.
- **Demonstrates cross-contract communication** — a key Soroban feature, showcased via the `BadgeClient` typed client auto-generated from `#[contractclient]`.
- **Security boundary** — `badge.award()` checks `admin.require_auth()` where `admin` is the **fund contract's own address**, preventing any external caller from minting badges.

---

## 2. Non-Custodial Architecture

**Decision:** StellarFlow never holds, transmits, or has access to private keys.

**Rationale:**
- Trust minimisation is a core principle of decentralised applications.
- Freighter's `signTransaction()` API handles the signing flow inside the extension — the dApp only receives a signed XDR blob.
- Users retain full sovereignty over their funds at all times.

---

## 3. Flat React State (No Redux / Context)

**Decision:** State is lifted to `Header.js` with props passed down; no global state manager is used.

**Rationale:**
- The app has a small component tree — global state is unnecessary overhead.
- All wallet state (`address`, `balance`, `isConnected`) is owned by `Header.js`, the top-level component, and passed to children via props/callbacks.
- Keeps the codebase simple and avoids extra dependencies.

---

## 4. Pure Helpers in `lib/stellar.js`

**Decision:** Conversion, validation, and tier-mapping logic is extracted into a dependency-free module.

**Rationale:**
- **Testability** — pure functions with no network calls or DOM access are trivially unit-testable with Jest. This is why there are 9 frontend tests even though the app is small.
- **Reusability** — the same helpers are used in both the UI and tests without mocking.
- **Reliability** — stroop/XLM conversion is a common source of precision bugs; isolating it enables precise regression testing.

---

## 5. `localStorage` for Transaction History

**Decision:** Transaction records are persisted to `localStorage` rather than a backend or on-chain index.

**Rationale:**
- **No backend needed** — keeps the project fully decentralised (no server to maintain or trust).
- **Simplicity** — the history is user-specific and browser-local, so server-side storage would add complexity without user benefit.
- **Acceptable limitations** — users are aware that history is browser-scoped; on-chain history is always available via Stellar Expert.

---

## 6. WebGL Hero with OGL (not Three.js)

**Decision:** The landing page light-rays hero uses the `ogl` library; `three.js` is used for the secondary `MagicRings` effect.

**Rationale:**
- `ogl` is a minimal WebGL abstraction (~20 KB gzipped) — ideal for a custom GLSL shader-based effect where Three.js would be over-engineered.
- Custom GLSL fragment shaders give pixel-level control over the light-rays aesthetic that CSS animations cannot replicate.
- `three.js` is used where its higher-level abstractions (geometry helpers, camera rigs) provide genuine value for MagicRings.

---

## 7. HTTPS Required in Development

**Decision:** `npm start` is configured with `HTTPS=true` (via `cross-env`).

**Rationale:**
- Freighter's browser API requires a **secure context** (`https://` or `localhost`) to expose wallet methods.
- Without HTTPS the `setAllowed()` and `requestAccess()` calls either fail silently or throw, making wallet connection impossible.

---

## 8. Soroban `require_auth()` for Access Control

**Decision:** The `withdraw()` method uses `require_auth()` rather than a manual address comparison.

**Rationale:**
- `require_auth()` integrates with Soroban's composable auth framework — the transaction must include an `auth_entry` signed by the owner key.
- This prevents replay attacks and works correctly with multi-sig setups if the owner is ever a multi-sig account.
- Simpler and more secure than a manual `if env.current_contract_address() != owner { panic!() }` guard.

---

## 9. Stroops as `i128` in the Contract

**Decision:** All monetary amounts are `i128` internally in the Soroban contract.

**Rationale:**
- `i128` is the native numeric type for Soroban token amounts (SAC interface standard).
- Avoids floating-point precision issues — all arithmetic is done in integer stroops.
- The `toStroops()` helper in `lib/stellar.js` ensures the frontend correctly converts XLM decimals before building transactions.
