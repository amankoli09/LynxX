# Styling & Design System

StellarFlow uses **Vanilla CSS** with a comprehensive design system defined in `App.css`. The aesthetic is a **glassmorphism dark theme** with luminous accent colours and smooth micro-animations.

---

## Design Philosophy

- **Dark mode first** — deep navy/space backgrounds create contrast for luminous UI elements.
- **Glassmorphism** — translucent panels with `backdrop-filter: blur()` for depth.
- **Luminous accents** — vibrant purple/blue gradients for CTAs and highlights.
- **Micro-animations** — entrance animations, hover effects, and state transitions.

---

## CSS Custom Properties (Tokens)

```css
:root {
  /* Colours */
  --color-bg:           #05080f;
  --color-surface:      rgba(255, 255, 255, 0.04);
  --color-border:       rgba(255, 255, 255, 0.08);
  --color-accent:       #7c5cfc;
  --color-accent-light: #a78bfa;
  --color-success:      #22c55e;
  --color-error:        #ef4444;
  --color-text:         #f0f0ff;
  --color-muted:        rgba(240, 240, 255, 0.5);

  /* Typography */
  --font-sans: "Inter", "Outfit", system-ui, sans-serif;

  /* Spacing */
  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* Blur */
  --blur-sm: blur(8px);
  --blur-md: blur(16px);
  --blur-lg: blur(32px);
}
```

---

## Glass Panel Mixin

The glassmorphism card style is applied to all dashboard panels:

```css
.glass-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## Typography

Google Fonts: **Inter** + **Outfit** loaded via `@import` in `index.css`.

| Scale | Size | Weight | Usage |
|---|---|---|---|
| Display | 3.5rem | 700 | Hero headline |
| H1 | 2.5rem | 700 | Page titles |
| H2 | 1.75rem | 600 | Section headers |
| H3 | 1.25rem | 600 | Card headers |
| Body | 1rem | 400 | Default text |
| Small | 0.875rem | 400 | Labels, captions |
| Mono | 0.85rem | 400 | Addresses, hashes |

---

## Animations

| Animation | Keyframe | Usage |
|---|---|---|
| `fadeInUp` | `0% → opacity 0, translateY 20px` | Panel entrance |
| `shimmer` | `0% → 100% background-position` | Loading skeleton |
| `pulse` | `0% → 100% opacity 0.6–1` | Status indicators |
| `gradientFlow` | Background-position sweep | Gradient button hover |
| `counterUp` | `transform: scale` | Counter entrance |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | `< 640px` | Single column, stacked panels |
| Tablet | `640px – 1024px` | 2-column grid |
| Desktop | `> 1024px` | 3-column dashboard grid |

---

## Button Styles

| Class | Appearance | Use |
|---|---|---|
| `.btn-primary` | Purple gradient, glow on hover | Primary CTA |
| `.btn-secondary` | Glass surface, border | Secondary action |
| `.btn-ghost` | Transparent, text only | Navigation |
| `.btn-danger` | Red gradient | Destructive actions |
