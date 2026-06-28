# Address Validation

Before building any transaction, StellarFlow validates that the recipient address is a properly-formatted Stellar public key.

---

## Stellar Address Format

A Stellar public key (also called a StrKey-encoded ED25519 key) has the following properties:

- Starts with the letter **`G`**
- Exactly **56 characters** long
- Uses the **base-32 alphabet** (uppercase A–Z and digits 2–7)
- Includes a built-in **checksum** (last 2 bytes)

Example: `GABC...WXYZ` (56 characters total)

---

## Validation Helper (`src/lib/stellar.js`)

```js
/**
 * Client-side format check for a Stellar public key: starts with `G`,
 * 56 chars, base32 alphabet (A–Z, 2–7). Not a checksum validation, but
 * enough to reject obvious typos before building a transaction.
 */
export function isValidStellarAddress(address) {
    return typeof address === "string" && /^G[A-Z2-7]{55}$/.test(address);
}
```

This is a **format check**, not a full StrKey checksum validation. It rejects:
- Addresses that don't start with `G`
- Addresses shorter or longer than 56 characters
- Addresses with invalid characters (lowercase, special chars, digits 0/1/8/9)

It does **not** verify:
- Whether the address actually exists on-chain
- Whether the checksum bytes are valid

---

## Full Checksum Validation

For full StrKey validation (including checksum), use the Stellar SDK:

```js
import { StrKey } from "@stellar/stellar-sdk";

function isValidStellarAddressFull(address) {
  try {
    StrKey.decodeEd25519PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
```

The lightweight regex version in `lib/stellar.js` is sufficient for UI input validation (fast, no dependencies). Use the SDK version for critical paths.

---

## Where Validation is Applied

| Location | Method | When |
|---|---|---|
| Send XLM form | `isValidStellarAddress()` | On every keystroke (real-time) |
| Connect flow | `isValidStellarAddress()` | After `requestAccess()` returns |
| Contract invocation | SDK validates on-chain | At transaction execution time |

---

## Unit Tests

```js
// src/lib/stellar.test.js
test("accepts a valid Stellar address", () => {
  expect(isValidStellarAddress("GABC" + "A".repeat(52))).toBe(true);
});

test("rejects address not starting with G", () => {
  expect(isValidStellarAddress("XABC" + "A".repeat(52))).toBe(false);
});

test("rejects short addresses", () => {
  expect(isValidStellarAddress("GABC")).toBe(false);
});
```

---

## User-Facing Error Messages

| Input | Error Shown |
|---|---|
| Empty | "Please enter a recipient address." |
| Wrong length | "Stellar addresses are 56 characters." |
| Invalid chars | "Invalid Stellar address format." |
| Sending to self | "You cannot send XLM to your own address." |
