# Frontend Helper Functions

Reference for all utility functions exported from `src/lib/stellar.js`.

---

## Overview

`src/lib/stellar.js` is a **pure, dependency-free** utility module. It contains no network calls, no DOM access, and no side effects. All functions are synchronous and fully unit-tested.

---

## `STROOPS`

```js
export const STROOPS = 10_000_000;
```

The number of stroops in one XLM. Use this constant instead of hard-coding `10_000_000`.

---

## `toStroops(xlm)`

```js
export function toStroops(xlm: string | number): BigInt
```

Converts an XLM amount to stroops as a `BigInt`.

| Parameter | Type | Description |
|---|---|---|
| `xlm` | `string \| number` | Amount in XLM (e.g. `"10"`, `1.5`, `0`) |

**Returns:** `BigInt` — amount in stroops. Returns `BigInt(0)` for non-numeric input.

```js
toStroops(1)     // → BigInt(10_000_000)
toStroops(0.5)   // → BigInt(5_000_000)
toStroops("abc") // → BigInt(0)
```

---

## `fromStroops(stroops)`

```js
export function fromStroops(stroops: BigInt | number | string): number
```

Converts stroops to XLM as a `Number`.

| Parameter | Type | Description |
|---|---|---|
| `stroops` | `BigInt \| number \| string` | Amount in stroops |

**Returns:** `number` — XLM value.

```js
fromStroops(10_000_000)     // → 1
fromStroops(BigInt(5_000_000)) // → 0.5
```

---

## `isValidStellarAddress(address)`

```js
export function isValidStellarAddress(address: string): boolean
```

Validates that a string matches the Stellar public key format (`G` + 55 base-32 chars).

| Parameter | Type | Description |
|---|---|---|
| `address` | `string` | Stellar address to validate |

**Returns:** `boolean`

```js
isValidStellarAddress("G" + "A".repeat(55)) // → true
isValidStellarAddress("XINVALID")           // → false
isValidStellarAddress("")                   // → false
```

> This is a format check only — not a full StrKey checksum validation.

---

## `tierName(tier)`

```js
export function tierName(tier: number | BigInt): string
```

Maps a badge tier number to a human-readable name.

| Parameter | Type | Description |
|---|---|---|
| `tier` | `number \| BigInt` | Tier value from the badge contract (0–3) |

**Returns:** `string`

```js
tierName(0) // → "None"
tierName(1) // → "Bronze"
tierName(2) // → "Silver"
tierName(3) // → "Gold"
```

---

## `shortAddress(address)`

```js
export function shortAddress(address: string): string
```

Truncates a Stellar address for display (e.g. `GABC…WXYZ`).

| Parameter | Type | Description |
|---|---|---|
| `address` | `string` | Full Stellar address |

**Returns:** `string` — first 4 + `…` + last 4 chars. Returns `""` for falsy input.

```js
shortAddress("GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ")
// → "GABC…WXYZ"

shortAddress(null) // → ""
```

---

## Unit Tests

All functions above are tested in `src/lib/stellar.test.js`. Run with:

```bash
CI=true npm test
```
