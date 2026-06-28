# Frontend Error States

This page documents all user-visible error states in StellarFlow and how they are displayed.

---

## Error State Categories

| Category | Location | Display Style |
|---|---|---|
| Wallet connection errors | Connect flow | Full-width error banner |
| Form validation errors | Send XLM / Donate forms | Inline field error |
| Transaction errors | After submission | Error banner with retry |
| Contract errors | After on-chain execution | Error message with code |
| Network errors | Any network call | Toast notification |

---

## Wallet Connection Errors

| Error | Message Shown | Recovery |
|---|---|---|
| Freighter not installed | "Freighter not detected. Install the extension →" | Link to freighter.app |
| Permission denied | "Wallet access denied. Please approve the connection." | Retry button |
| Wrong network | "Please switch Freighter to Testnet." | Instructions |
| Address invalid | "Received an invalid Stellar address." | Contact support |

---

## Form Validation Errors

| Field | Error | Condition |
|---|---|---|
| Recipient | "Please enter a recipient address." | Empty |
| Recipient | "Invalid Stellar address format." | Fails `isValidStellarAddress()` |
| Recipient | "Cannot send to your own address." | Recipient = sender |
| Amount | "Please enter an amount." | Empty |
| Amount | "Amount must be greater than 0." | `≤ 0` |
| Amount | "Insufficient balance (including fee)." | `amount + fee > balance` |

---

## Transaction Errors

| Error | Message Shown | Retryable? |
|---|---|---|
| `ZeroAmount` | "Donation must be greater than zero." | ✅ (fix amount) |
| `CampaignClosed` | "This campaign has reached its goal." | ❌ |
| `NothingRaised` | "No funds to withdraw." | ❌ |
| Signing declined | "Transaction cancelled." | ✅ |
| Network timeout | "Transaction not confirmed. Check explorer." | ✅ |
| RPC error | "Network error. Please try again." | ✅ |

---

## Error Component Pattern

```jsx
// Reusable ErrorBanner component
function ErrorBanner({ message, onDismiss, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert" aria-live="polite">
      <span className="error-icon">⚠</span>
      <span className="error-text">{message}</span>
      {onRetry && (
        <button className="btn-ghost" onClick={onRetry}>↺ Retry</button>
      )}
      <button className="btn-ghost icon-btn" onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
```

---

## Accessibility

All error messages use:
- `role="alert"` — announces the error to screen readers immediately
- `aria-live="polite"` — allows screen readers to finish current speech before reading
- High-contrast red colour (`--color-error: #ef4444`) with ≥ 4.5:1 contrast ratio

---

## Related Docs

- [Contract Errors →](./contract-errors.md)
- [Wallet Integration Error Handling →](../wallet-integration/error-handling.md)
- [Retry & Failure Handling →](../transactions/retry-failure-handling.md)
