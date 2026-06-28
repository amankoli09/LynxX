# Responsive Design

StellarFlow is fully responsive across mobile, tablet, and desktop viewports.

---

## Breakpoints

| Name | Min Width | Grid Layout |
|---|---|---|
| Mobile | `< 640px` | Single column, stacked panels |
| Tablet | `640px` | 2-column grid |
| Desktop | `1024px` | 3-column dashboard grid |
| Wide | `1440px` | Max-width container, centred |

```css
/* Mobile first */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Mobile Considerations

- **Navigation** collapses into a hamburger menu on `< 640px`.
- **Glass panels** use full-width layout on mobile.
- **WebGL canvas** (`LightRays`) is hardware-accelerated and works on mobile browsers.
- **Touch events** are handled for the WebGL mouse-tracking effect via `touchmove`.
- **Font sizes** scale down slightly on mobile using `clamp()`:
  ```css
  h1 { font-size: clamp(1.8rem, 5vw, 3.5rem); }
  ```

---

## Freighter on Mobile

Freighter is a **browser extension** available primarily on desktop Chrome/Brave/Firefox. On mobile:
- The dApp still loads and displays the landing page.
- The "Connect" button shows a message pointing users to use a desktop browser.
- Transaction submission is desktop-only in the current version.

---

## Testing Responsive Layout

Use Chrome DevTools Device Toolbar to test:
1. Open DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select preset devices: iPhone SE, iPad, or set custom dimensions

---

## Max Container Width

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
```
