# Car Assistance — Design System (v1.0)
**Mobile-first · Mercedes-Benz-inspired · Zero AI slop**

---

## 1. Research basis (honest note)

Direct access to Mercedes-Benz's official design-system portals (`designsystem.mercedes-benz.com`, group press/design pages) was blocked during research (HTTP 403). This system is therefore derived from **well-documented, publicly observable traits** of the Mercedes-Benz digital design language, which are stable and widely known:

- **Monochrome discipline.** Mercedes digital surfaces are overwhelmingly dark navy, white and greys. Colour is reserved for meaning, never decoration. (Chrome colour: `#12214F` deep navy, user-approved 2026-11.)
- **The dark "pill"/rectangular CTA.** mercedes-benz.com drives every primary action with a solid dark, low-radius button with white text. Our primary buttons copy this exactly (in deep navy).
- **Hairline structure.** Sections and list items are divided by 1px hairlines rather than boxed cards. Content floats on generous whitespace.
- **Tracked uppercase micro-labels.** Small caps labels with wide letter-spacing ("SUV · HATCHBACK", "EQ TECHNOLOGY") are a signature of MB product pages. We use them as the structural skeleton of every screen.
- **Typography-first hierarchy.** MB's proprietary type (MB Corpo S / historically Corporate A+S / Neue Helvetica) relies on **weight and size contrast within a single grotesque family** — never on colour or ornament. We use a free neutral grotesque stack (`Helvetica Neue / Arial`) and express hierarchy through weight, size and tracking only.
- **Restrained geometry.** Small radii (4–8px), no blobs, no glow. The star emblem's geometry is circle-based; our circular icon chips echo it.
- **Motion as confirmation, not spectacle.** Fast, short transitions (150–250ms ease-out). Nothing bounces.

> Because of the access restriction, no proprietary MB asset, font, or exact hex is reproduced. This is an **inspired** system, legally clean for an academic project, and documented as such.

## 2. Anti-slop checklist (hard rules — a PR violating any of these is rejected)

| ✗ Forbidden | ✓ Instead |
|---|---|
| Purple/violet gradients, "AI glow" | Monochrome surfaces; colour only for severity |
| Glassmorphism / frosted blur | Solid surfaces + hairlines |
| Emoji as UI icons | Inline SVG stroke icons (1.5px stroke, circular chip) |
| Generic identity font (Inter/Roboto as the "brand") | Neutral grotesque stack; hierarchy via weight/tracking |
| 3 equal-width gradient card heroes | Hairline list rows + one strong statement block |
| Rounded-2xl bubbly radii everywhere | 4px controls, 8px sheets |
| Decorative illustrations/AI art | Data, typography, and whitespace |
| Rainbow severity colours | Two-level signal only: neutral · danger red |

## 3. Design tokens

### 3.1 Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | `#12214F` | Primary text, dark bands, primary CTA fill — **deep Mercedes navy (user-approved; replaces black)** |
| `--carbon` | `#0B1636` | Dark band gradient end, pressed states |
| `--paper` | `#FFFFFF` | Page background |
| `--mist` | `#F4F4F4` | Secondary surface (rows, chips) |
| `--line` | `#E3E3E3` | Hairline dividers, borders |
| `--mut` | `#6E6E6E` | Secondary text |
| `--faint` | `#9A9A9A` | Tertiary text on dark |
| `--ice` | `#C9C9C9` | Body text on dark bands |
| `--danger` | `#C53030` | Critical severity only (brakes/steering/fuel) |
| `--danger-soft` | `#FDECEC` | Danger background tint |
| `--safe` | `#1F7A5C` | "OK to drive" confirmation only |

**Rule:** colour appears only when it carries meaning (severity, success). Every UI chrome element is monochrome.

### 3.2 Typography

| Token | Value |
|---|---|
| Stack | `"Helvetica Neue", "Segoe UI", Arial, sans-serif` |
| Display (H1) | 26px / 700 / -0.5px |
| Title (H2) | 20px / 700 / -0.3px |
| Body | 15px / 400 / 1.55 line-height |
| Micro-label | 11px / 600 / `letter-spacing: .12em` / UPPERCASE |
| Code numeral | 30px / 300 / `font-variant-numeric: tabular-nums` |

Micro-labels are the navigation skeleton: every screen section opens with one.

### 3.3 Geometry & spacing

- Radii: controls `4px`, sheets/cards `8px`, icon chips `50%`.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32.
- Hairline: `1px solid var(--line)`.
- Shadows: none (flat; hairlines do the separation).
- Content max-width: `480px` centered on desktop (phone frame discipline).

### 3.4 Iconography

Inline SVG, 24px grid, `stroke: 1.5px`, `stroke-linecap: round`. Icons sit in 40px circular chips (`--mist` fill, or `--danger-soft` for critical). No emoji anywhere.

### 3.5 Motion

`transition: 180ms ease-out` on interactive elements only. States: pressed = background `--mist`→`--line`. No scale/glow effects.

## 4. Core components (as implemented in `demo/assets/css/styles.css`)

| Component | Spec |
|---|---|
| `topbar` | 52px; back chevron left; tracked micro-title; hairline bottom |
| `btn-primary` | Solid `--ink`, white text, 4px radius, 48px height (thumb target) |
| `btn-ghost` | 1px hairline border, ink text |
| `btn-danger` | `--danger` fill — emergency actions only |
| `row` (list item) | Hairline-separated; icon chip right-aligned content; chevron; tap area ≥ 48px |
| `search` | 44px, `--mist` fill, magnifier icon, 4px radius |
| `severity-badge` | Micro-label + dot: `HIGH` (danger), `MEDIUM` (ink), `LOW` (mut) |
| `code-card` | Hero of detail page: big tabular code numeral + name, dark band |
| `steps` | Ordered repair steps with hairline separators, numbered in 12px circles |
| `chat-bubble` | User: `--ink` fill white text; system: `--mist` fill ink text; sources shown as micro-label citations |
| `sheet-danger` | Full-width danger block: `--danger` header bar + `--danger-soft` body, MAYDAY buttons inside |
| `tabbar` | 4 items bottom-fixed (Home, Codes, Chat, More); SVG icon + 10px label; active = ink, inactive = mut |

## 5. Screen architecture (mobile-first)

Every screen: `topbar → content (max 480px) → tabbar`. No desktop-first fallbacks: the 480px column *is* the design; on larger viewports it centers on `--mist` canvas like a device preview.

Screen inventory (demo):
1. `index.html` — statement block ("Understand your Mercedes."), 3 entry rows, vehicle band (W245 facts)
2. `codes.html` — search + severity-filtered list of W245 codes
3. `code.html?code=…` — detail: severity, symptoms, causes, steps, MAYDAY if critical
4. `chat.html` — scripted symptom → diagnosis flow with citations
5. `photo.html` — mock VLM: upload → detected warning → code link
6. `mayday.html` — one-tap call + WhatsApp, shown after critical results
7. `locator.html` — Cairo workshops sorted by haversine from mock position

## 6. Accessibility

- Contrast: ink/paper = 19:1; mut on paper ≥ 4.6:1; white on danger ≥ 4.5:1.
- All tap targets ≥ 44×44px. Focus visible: `2px solid var(--ink)` outline.
- Severity never conveyed by colour alone — always paired with a text micro-label.
