# Integration Tests

Integration tests verify that the frontend components interact correctly with the Soroban RPC and Freighter API. These tests are currently manual (see [Manual Test Plan](./manual-test-plan.md)) but this page outlines the structure for automated integration tests.

---

## Current Status

Integration tests are **not yet automated**. The testing strategy is:
- **Unit tests:** `src/lib/stellar.test.js` — 9 tests (automated ✅)
- **Contract tests:** `contract/src/test.rs` — 11 tests (automated ✅)
- **Integration tests:** Manual test plan (not yet automated)

---

## Planned Integration Test Architecture

### Mocking Strategy

Freighter API and Soroban RPC should be mocked using Jest:

```js
// __mocks__/@stellar/freighter-api.js
const mockAddress = "GABC" + "A".repeat(52);

export const isConnected = jest.fn(() => Promise.resolve(true));
export const setAllowed = jest.fn(() => Promise.resolve());
export const requestAccess = jest.fn(() => Promise.resolve({ address: mockAddress }));
export const signTransaction = jest.fn((xdr) => Promise.resolve(xdr + "_signed"));
```

```js
// __mocks__/@stellar/stellar-sdk.js (partial)
export const SorobanRpc = {
  Server: jest.fn(() => ({
    simulateTransaction: jest.fn(() => Promise.resolve({ result: "ok" })),
    sendTransaction: jest.fn(() => Promise.resolve({ hash: "abc123", status: "PENDING" })),
    getTransaction: jest.fn(() => Promise.resolve({ status: "SUCCESS" })),
  })),
};
```

---

## Planned Integration Tests

### Wallet Connect Flow

```js
test("connects wallet and displays balance", async () => {
  render(<Header />);
  fireEvent.click(screen.getByText("Connect"));
  await waitFor(() => {
    expect(screen.getByText(/GABC/)).toBeInTheDocument();
    expect(screen.getByText(/XLM/)).toBeInTheDocument();
  });
});
```

### Send XLM Flow

```js
test("sends XLM successfully", async () => {
  render(<Header walletAddress={mockAddress} isConnected={true} />);
  fireEvent.change(screen.getByLabelText("Recipient"), { target: { value: "G" + "A".repeat(55) }});
  fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "10" }});
  fireEvent.click(screen.getByText("Process Transfer"));
  await waitFor(() => {
    expect(screen.getByText(/Transaction confirmed/)).toBeInTheDocument();
  });
});
```

### Address Validation

```js
test("shows error for invalid address", async () => {
  render(<Header isConnected={true} />);
  fireEvent.change(screen.getByLabelText("Recipient"), { target: { value: "INVALID" }});
  fireEvent.click(screen.getByText("Process Transfer"));
  expect(screen.getByText(/Invalid Stellar address/)).toBeInTheDocument();
});
```

---

## Running Integration Tests (Future)

```bash
npm test -- --testPathPattern=integration
```

---

## Related Docs

- [Frontend Unit Tests →](./frontend-unit-tests.md)
- [Contract Tests →](./contract-tests.md)
- [Manual Test Plan →](./manual-test-plan.md)
