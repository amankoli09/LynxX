# Stroop ↔ XLM Conversion

All monetary amounts in Soroban contracts and the Stellar protocol are expressed in **stroops** — the smallest unit of XLM.

---

## The Conversion Rate

```
1 XLM = 10,000,000 stroops  (10^7)
```

---

## Why Stroops?

Using integer arithmetic (stroops) avoids floating-point precision errors. All on-chain values, contract parameters, and Horizon API responses use stroops.

---

## Helper Functions (`src/lib/stellar.js`)

```js
export const STROOPS = 10_000_000;

/** Convert XLM (string or number) → BigInt stroops */
export function toStroops(xlm) {
    const n = parseFloat(xlm);
    if (!Number.isFinite(n)) return BigInt(0);
    return BigInt(Math.round(n * STROOPS));
}

/** Convert stroops (BigInt | number | string) → XLM as Number */
export function fromStroops(stroops) {
    return Number(BigInt(stroops)) / STROOPS;
}
```

---

## Conversion Examples

| XLM | Stroops |
|---|---|
| 1 XLM | 10,000,000 |
| 0.5 XLM | 5,000,000 |
| 10 XLM | 100,000,000 |
| 100 XLM | 1,000,000,000 |
| 1,000 XLM (campaign goal) | 10,000,000,000 |

---

## BigInt Usage

The Soroban JS SDK returns contract `i128` values as JavaScript `BigInt`. The `fromStroops()` helper converts them to `Number` for display:

```js
const raisedStroops = await contract.raised(); // BigInt
const raisedXLM = fromStroops(raisedStroops);  // Number
display(`${raisedXLM.toFixed(2)} XLM`);
```

> **Precision note:** JavaScript `Number` has 53-bit integer precision (~9 quadrillion). Since 1 XLM = 10^7 stroops, values up to ~900 trillion XLM are representable without precision loss — well beyond practical campaign sizes.

---

## Contract-Side Stroops

In the Rust contract, amounts are `i128`. The campaign goal is set at constructor time:

```rust
// 1,000 XLM = 10,000,000,000 stroops
fn __constructor(env: Env, owner: Address, token: Address, goal: i128) {
    // goal passed as 10_000_000_000 from the deploy command
}
```

From the CLI:
```bash
stellar contract invoke -- __constructor \
  --owner G... \
  --token CDLZFC3... \
  --goal 10000000000
```

---

## Unit Tests

The stroop conversion helpers are covered by Jest tests in `src/lib/stellar.test.js`:

```js
test("toStroops converts 1 XLM correctly", () => {
    expect(toStroops(1)).toBe(BigInt(10_000_000));
});

test("fromStroops converts 10_000_000 back to 1", () => {
    expect(fromStroops(10_000_000)).toBe(1);
});
```
