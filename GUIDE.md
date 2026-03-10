# HotelNova — Frontend Design System Guide

> **Agent Instructions:** This is the single source of truth for all visual and UI decisions
> in the HotelNova frontend. Before writing any component, page, or style, read the relevant
> section of this file. Never introduce colors, font sizes, spacing values, or component
> patterns that are not documented here. If a new decision is made, update this file.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing Scale](#4-spacing-scale)
5. [Grid & Layout](#5-grid--layout)
6. [Component Specifications](#6-component-specifications)
7. [Implementation — CSS Tokens](#7-implementation--css-tokens)

---

## 1. Brand Identity

| Field        | Value                              |
|--------------|------------------------------------|
| **Brand**    | HotelNova                          |
| **Location** | Abuja, Nigeria                     |
| **Tagline**  | *"Elevate Your Stay"*              |
| **Tone**     | Premium, trustworthy, modern       |
| **System**   | Design System v1.0                 |

The HotelNova visual identity communicates **luxury and precision**. Every spacing
decision, color choice, and typographic scale is intentional. When in doubt, lean
toward more whitespace and fewer decorative elements.

---

## 2. Color System

### 2.1 Primary Palette

These are the core brand colors. Use them consistently across all touchpoints.

| Name              | Hex       | CSS Token              | Usage                                          |
|-------------------|-----------|------------------------|------------------------------------------------|
| **Electric Royal** | `#020887` | `--color-primary`      | Primary CTA buttons, page headers, active nav states |
| **Egyptian Blue**  | `#38369A` | `--color-primary-soft` | Secondary buttons, hover states, interactive elements |
| **Steel Blue**     | `#7CA5B8` | `--color-accent`       | Icons, accents, informative badges, muted graphics   |
| **Caledon**        | `#A9DBBB` | `--color-surface-tint` | Soft section backgrounds, subtle grouping containers |
| **Tea Green**      | `#C6EBBE` | `--color-success-soft` | Success state highlights, marketing flourishes       |

### 2.2 Neutrals

| Name                    | Hex       | CSS Token           | Usage                        |
|-------------------------|-----------|---------------------|------------------------------|
| **White**               | `#FFFFFF` | `--color-white`     | Component backgrounds, cards |
| **Light Gray**          | `#F8FAFC` | `--color-bg`        | Page / app background        |
| **Mid Gray**            | `#E2E8F0` | `--color-border`    | Borders, dividers, separators|

### 2.3 Status Colors

| Name               | Hex       | CSS Token            | Usage                        |
|--------------------|-----------|----------------------|------------------------------|
| **Success Green**  | `#10B981` | `--color-success`    | Confirmed badge, success toast |
| **Error Red**      | `#EF4444` | `--color-error`      | Error states, cancelled badge, form errors |
| **Warning Orange** | `#F97316` | `--color-warning`    | Pending badge, warning states |

### 2.4 Color Usage Rules

- **Never** use Electric Royal (`#020887`) as a background for body text — only for buttons and headings.
- **Never** mix multiple primary colors in the same UI region. Pick one dominant.
- Status colors (`success`, `error`, `warning`) must **always** be accompanied by text or an icon — never color alone (ACCESSIBILITY.md rule).
- `--color-bg` (`#F8FAFC`) is the default page background. White (`#FFFFFF`) is for cards and modals.
- Steel Blue (`#7CA5B8`) is for supporting elements only — never for primary actions.

---

## 3. Typography

### 3.1 Font Family

The HotelNova type system uses a clean geometric sans-serif. Based on the design
specimens, the typeface is **Plus Jakarta Sans** or **Inter** (confirm in Figma).
Both are available from Google Fonts.

```css
/* Recommended import */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
```

### 3.2 Type Scale

| Role                  | Size  | Weight    | Line Height | CSS Class       | Use Case                          |
|-----------------------|-------|-----------|-------------|-----------------|-----------------------------------|
| **H1 — Display**      | 48px  | Bold 700  | 1.1         | `.text-display` | Main page titles, hero headlines  |
| **H2 — Section**      | 36px  | Semibold 600 | 1.2      | `.text-h2`      | Section headers                   |
| **H3 — Card Title**   | 24px  | Semibold 600 | 1.3      | `.text-h3`      | Card titles, sub-section headings |
| **Body Large**        | 18px  | Regular 400 | 1.6       | `.text-lg`      | Introductory paragraphs, lead text|
| **Body Base**         | 16px  | Regular 400 | 1.6       | `.text-base`    | Standard body content             |
| **Body Small**        | 14px  | Regular 400 | 1.5       | `.text-sm`      | Captions, legal copy, meta info   |
| **Button / Label**    | 16px  | Medium 500  | 1.0       | `.text-btn`     | Buttons (often uppercase tracked) |

### 3.3 Typography Rules

- **Minimum body text size is 16px.** Never go below 14px for readable content (ACCESSIBILITY.md).
- Use **relative units (rem)** in CSS — `1rem = 16px` base.
- Color for standard body text: `--color-text` (dark navy, close to `#0D0F2B`).
- Color for muted/secondary text: `--color-text-muted` (use `#64748B` or similar slate).
- **Heading color:** Electric Royal `#020887` for major headings in the design; dark navy for general headings.
- Button text is **uppercase** with moderate letter-spacing (`0.08em`).
- Paragraph max-width: **65–75 characters** for comfortable reading (ACCESSIBILITY.md).

---

## 4. Spacing Scale

HotelNova uses a **base-8 spacing system**. All spacing values are multiples of 8.
Only use values from this scale — no arbitrary pixel values.

| Token         | Value  | Tailwind Equivalent | Common Use                              |
|---------------|--------|---------------------|-----------------------------------------|
| `--space-xs`  | 4px    | `gap-1` / `p-1`    | Micro-gaps, icon padding                |
| `--space-sm`  | 8px    | `gap-2` / `p-2`    | Button internal vertical padding, tight gaps |
| `--space-base`| 16px   | `gap-4` / `p-4`    | Header-to-body spacing, standard gaps  |
| `--space-md`  | 24px   | `gap-6` / `p-6`    | **Card internal padding (standard)**   |
| `--space-lg`  | 32px   | `gap-8` / `p-8`    | Component separation                   |
| `--space-xl`  | 48px   | `gap-12` / `p-12`  | Section internal padding               |
| `--space-2xl` | 64px   | `gap-16` / `p-16`  | Large section gaps                     |
| `--space-3xl` | 80px   | `gap-20` / `p-20`  | Desktop section margins                |
| `--space-mega`| 128px  | `gap-32` / `p-32`  | Hero section height pads               |

### Spacing Rules

- **Card padding:** Always `24px` (`--space-md`) internally.
- **Section spacing:** `120px` vertical gap between major page sections on desktop.
- **Header-to-body gap** inside a card: `16px` (`--space-base`).
- **CTA button vertical padding:** `8px` top and bottom (`--space-sm`).
- When in doubt, **round to the nearest 8px unit**.

---

## 5. Grid & Layout

### 5.1 Grid System

| Device         | Columns | Margins | Gutters | Breakpoint |
|----------------|---------|---------|---------|------------|
| **Desktop**    | 12      | 80px    | 24px    | 1440px+    |
| **Mobile**     | 4       | 20px    | 16px    | 375px      |

### 5.2 Layout Constraints

| Constraint              | Value  | Notes                                              |
|-------------------------|--------|----------------------------------------------------|
| **Max container width** | 1440px | Content never expands beyond this on ultra-wide screens |
| **Section spacing**     | 120px  | Vertical breathing room between major page sections |
| **Card padding**        | 24px   | Standard internal padding for all interactive cards |

### 5.3 Container Pattern

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: 80px; /* desktop */
}

@media (max-width: 768px) {
  .container {
    padding-inline: 20px; /* mobile */
  }
}
```

### 5.4 Responsive Breakpoints

| Name     | Width   | Description             |
|----------|---------|-------------------------|
| `sm`     | 640px   | Large phones            |
| `md`     | 768px   | Tablets                 |
| `lg`     | 1024px  | Small laptops           |
| `xl`     | 1280px  | Standard desktop        |
| `2xl`    | 1440px  | Wide desktop (max)      |

---

## 6. Component Specifications

### 6.1 Buttons

Four variants. All buttons use `16px` font, `Medium 500` weight, uppercase text,
`8px` letter-spacing, `border-radius: 4px`.

| Variant       | Background     | Text           | Border         | Hover State             |
|---------------|----------------|----------------|----------------|-------------------------|
| **Primary**   | `#020887`      | `#FFFFFF`      | None           | `#38369A` (Egyptian Blue) |
| **Secondary** | Transparent    | `#020887`      | `#020887` 1.5px| Fill with `#020887`, text white |
| **Ghost**     | Transparent    | `#020887`      | None           | Light `#F8FAFC` bg      |
| **Disabled**  | `#E2E8F0`      | `#94A3B8`      | None           | No hover effect, `cursor: not-allowed` |

**Button sizing:**
- Padding: `12px 24px` (medium — standard)
- Min height: `44px` (ACCESSIBILITY.md touch target requirement)
- Full-width on mobile when used as primary CTA

### 6.2 Form Elements

**Default Input:**
- Border: `1px solid #E2E8F0`
- Border-radius: `4px`
- Padding: `12px 16px`
- Font: `16px` Body Base
- Placeholder color: `#94A3B8`
- Focus: border color `#020887`, subtle box-shadow

**Error State Input:**
- Border: `1.5px solid #EF4444`
- Error message below: `14px`, color `#EF4444`
- Error message must be linked via `aria-describedby` (ACCESSIBILITY.md)

**Select / Dropdown:**
- Same styling as default input
- Custom chevron icon (right-aligned)

**Checkbox:**
- Checked state: `#020887` fill
- Size: `18x18px` minimum (for touch targets consider `20x20px`)

**Radio Button:**
- Selected: `#020887` filled dot
- Border: `#020887` when selected, `#E2E8F0` when unselected

**All form inputs must have visible labels — never use placeholder as the only label
(ACCESSIBILITY.md).**

### 6.3 Status Badges

Small pill-shaped labels. `12px–13px` font, `Medium 500` weight, `border-radius: 999px` (full pill).

| Badge          | Background             | Text           | Border              |
|----------------|------------------------|----------------|---------------------|
| **Confirmed**  | `#D1FAE5` (light green)| `#10B981`      | None                |
| **Pending**    | `#FFEDD5` (light orange)| `#F97316`     | None                |
| **Cancelled**  | `#FEE2E2` (light red)  | `#EF4444`      | None                |
| **Maintenance**| `#DBEAFE` (light blue) | `#7CA5B8`      | None                |
| **Category**   | Transparent            | `#020887`      | `1px solid #020887` |

### 6.4 Room Card

Used on the rooms listing page and in booking flow.

```
┌──────────────────────────────┐
│  [Room Photo — 16:9 ratio]   │
│  AVAILABLE badge (top-left)  │
│  ★ 4.9 rating (top-right)   │
├──────────────────────────────┤  ← 24px padding
│  Presidential Suite          │  H3 / 24px Semibold / #020887
│  🛏 2 King   📐 120m²        │  14px / Steel Blue icons
│                              │
│  $850 /night                 │  24px Bold / Electric Royal
│                              │
│  [  Book Now  ]              │  Primary button / full width
└──────────────────────────────┘
```

- Card background: `#FFFFFF`
- Border-radius: `8px`
- Box-shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Photo aspect ratio: `16:9`
- Availability badge: `Confirmed` style (green pill) or custom `AVAILABLE` label
- Rating: star icon + number, positioned top-right of the image

### 6.5 Amenity / Feature Card

Used on the homepage amenities section.

```
┌──────────────────────────────┐
│  [Feature Image]             │
│  [Icon — bottom-right]       │
├──────────────────────────────┤
│  Infinity Pool               │  H3 / 24px Semibold
│  Heated outdoor pool with... │  Body Small / 14px / muted
│  View Details →              │  Link / 14px / Electric Royal
└──────────────────────────────┘
```

- Same card shell as Room Card
- Icon overlay in bottom-right of image (Steel Blue `#7CA5B8`)
- "View Details →" uses a text link style, no button

### 6.6 Guest Profile Card

Used in the guest dashboard and potentially admin views.

```
┌──────────────────────────────┐
│        [Avatar 64px]         │
│   Alhaji Musa Danjuma        │  H3 / 24px Semibold
│   ELITE GOLD MEMBER          │  12px / uppercase / muted
│                              │
│   STAYS        POINTS        │
│     12          4.2k         │  Stat labels 12px / values 24px Bold
└──────────────────────────────┘
```

- Membership tier label is uppercase, tracked, muted color
- Stats are displayed in a 2-column grid

### 6.7 Navigation Header

- Background: `#FFFFFF` with bottom border `#E2E8F0`
- Logo: `H` mark in Electric Royal + "HotelNova" wordmark
- Nav links: Body Base / 16px, active state uses Electric Royal + underline or indicator
- CTA button ("Book Now" / "Login"): Primary button variant
- Mobile: Hamburger menu collapses nav links

---

## 7. Implementation — CSS Tokens

Paste this into `hotel-nova-frontend/src/styles.css` as the design token foundation.
All components must reference these tokens — no hardcoded hex values in components.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

:root {
  /* ─── Brand Colors ─────────────────────────────── */
  --color-primary:       #020887; /* Electric Royal */
  --color-primary-soft:  #38369A; /* Egyptian Blue  */
  --color-accent:        #7CA5B8; /* Steel Blue     */
  --color-surface-tint:  #A9DBBB; /* Caledon        */
  --color-success-soft:  #C6EBBE; /* Tea Green      */

  /* ─── Neutrals ────────────────────────────────── */
  --color-white:         #FFFFFF;
  --color-bg:            #F8FAFC; /* Light Gray — page background  */
  --color-border:        #E2E8F0; /* Mid Gray — borders, dividers  */

  /* ─── Text ────────────────────────────────────── */
  --color-text:          #0D0F2B; /* Near-black navy — body text   */
  --color-text-muted:    #64748B; /* Slate — secondary, captions   */
  --color-text-inverse:  #FFFFFF; /* On dark/primary backgrounds   */

  /* ─── Status ──────────────────────────────────── */
  --color-success:       #10B981;
  --color-error:         #EF4444;
  --color-warning:       #F97316;

  /* ─── Status Backgrounds (for badges) ─────────── */
  --color-success-bg:    #D1FAE5;
  --color-error-bg:      #FEE2E2;
  --color-warning-bg:    #FFEDD5;
  --color-accent-bg:     #DBEAFE;

  /* ─── Typography ──────────────────────────────── */
  --font-sans:           'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --text-display:        3rem;      /* 48px — H1  */
  --text-h2:             2.25rem;   /* 36px — H2  */
  --text-h3:             1.5rem;    /* 24px — H3  */
  --text-lg:             1.125rem;  /* 18px — Body Large */
  --text-base:           1rem;      /* 16px — Body Base  */
  --text-sm:             0.875rem;  /* 14px — Body Small */

  /* ─── Spacing ─────────────────────────────────── */
  --space-xs:            0.25rem;  /* 4px  */
  --space-sm:            0.5rem;   /* 8px  */
  --space-base:          1rem;     /* 16px */
  --space-md:            1.5rem;   /* 24px — card padding */
  --space-lg:            2rem;     /* 32px */
  --space-xl:            3rem;     /* 48px */
  --space-2xl:           4rem;     /* 64px */
  --space-3xl:           5rem;     /* 80px */
  --space-mega:          7.5rem;   /* 120px — section spacing */

  /* ─── Layout ──────────────────────────────────── */
  --container-max:       1440px;
  --container-px:        80px;      /* desktop margin */
  --container-px-mobile: 20px;      /* mobile margin  */
  --grid-gutter:         24px;
  --grid-gutter-mobile:  16px;

  /* ─── Borders & Radius ────────────────────────── */
  --radius-sm:           4px;
  --radius-md:           8px;
  --radius-lg:           12px;
  --radius-pill:         999px;

  /* ─── Shadows ─────────────────────────────────── */
  --shadow-card:         0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md:           0 4px 16px rgba(0, 0, 0, 0.12);
}
```

---

> **Last updated:** March 2026
> **Source:** Figma Design System v1.0 — HotelNova | Abuja (`frontend-pngs/`)
> **Update this file** any time a design decision changes. Do not let it drift from the Figma source.
