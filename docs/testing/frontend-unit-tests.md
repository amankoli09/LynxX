# Frontend Unit Tests

StellarFlow includes 9 Jest unit tests covering the pure utility functions in `src/lib/stellar.js`.

---

## Running Tests

```bash
# Interactive mode (re-runs on file changes)
npm test

# CI mode (single run, no watcher)
CI=true npm test
```

Expected output:
```
PASS src/lib/stellar.test.js
  toStroops
    ✓ converts 1 XLM to 10_000_000 stroops (3ms)
    ✓ converts 0.5 XLM correctly
    ✓ returns BigInt(0) for non-numeric input
  fromStroops
    ✓ converts 10_000_000 stroops to 1 XLM
    ✓ handles BigInt input
  isValidStellarAddress
    ✓ accepts a valid G... address
    ✓ rejects address not starting with G
    ✓ rejects short addresses
  tierName
    ✓ returns correct tier names for 1/2/3

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

---

## Test File

**`src/lib/stellar.test.js`** — 9 tests across 4 test suites.

---

## Test Coverage

| Function | Tests | Cases |
|---|---|---|
| `toStroops(xlm)` | 3 | 1 XLM, 0.5 XLM, non-numeric |
| `fromStroops(stroops)` | 2 | number input, BigInt input |
| `isValidStellarAddress(addr)` | 3 | valid address, wrong prefix, wrong length |
| `tierName(tier)` | 1 | all 4 tier values (0/1/2/3) |

---

## Sample Tests

```js
import { toStroops, fromStroops, isValidStellarAddress, tierName } from "./stellar";

describe("toStroops", () => {
  test("converts 1 XLM to 10_000_000 stroops", () => {
    expect(toStroops(1)).toBe(BigInt(10_000_000));
  });

  test("converts 0.5 XLM correctly", () => {
    expect(toStroops(0.5)).toBe(BigInt(5_000_000));
  });

  test("returns BigInt(0) for non-numeric input", () => {
    expect(toStroops("abc")).toBe(BigInt(0));
  });
});

describe("isValidStellarAddress", () => {
  test("accepts a valid G... address", () => {
    expect(isValidStellarAddress("G" + "A".repeat(55))).toBe(true);
  });

  test("rejects address not starting with G", () => {
    expect(isValidStellarAddress("X" + "A".repeat(55))).toBe(false);
  });
});

describe("tierName", () => {
  test("returns correct tier names", () => {
    expect(tierName(0)).toBe("None");
    expect(tierName(1)).toBe("Bronze");
    expect(tierName(2)).toBe("Silver");
    expect(tierName(3)).toBe("Gold");
  });
});
```

---

## Why Only `lib/stellar.js` Is Tested

The functions in `lib/stellar.js` are **pure** — no network calls, no DOM access, no side effects. This makes them ideal for unit testing. Components like `Freighter.js` and `Fund.js` require Freighter extension mocks and Soroban RPC mocks to test, which is covered in [Integration Tests](./integration-tests.md).

---

## Adding New Tests

To add a test:
1. Open `src/lib/stellar.test.js`.
2. Add a new `describe` block or `test` case.
3. Run `npm test` to verify.
4. Ensure new utility functions in `stellar.js` are exported and tested before merging.
