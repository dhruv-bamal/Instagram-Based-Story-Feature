# Linear Dark — Design System

This app uses the Linear marketing dark aesthetic. Tokens are implemented in
`app/globals.css` via Tailwind v4's `@theme` block.

## Overview

The deepest dark surface — `canvas` #010102, near-pure black with a faint blue tint. On top
sits a four-step surface ladder (`surface-1` … `surface-4`) for cards, panels, and lifted tiles,
with hairline borders running from `hairline` (#23252a) up through `hairline-strong` and
`hairline-tertiary`. Light gray text (`ink` #f7f8f8) carries body and headlines.

The single chromatic accent is **Linear lavender-blue** `primary` (#5e6ad2) — used on the brand
mark, focus rings, and the primary CTA. Hover `primary-hover` (#828fff), focus `primary-focus`
(#5e69d1). No second chromatic color. The only semantic color is `success` (#27a644).

Display type runs Inter (substitute for Linear's custom sans) at weight 500–700 with negative
letter-spacing. Body at 400.

**Key characteristics**
- Dark-canvas system; `canvas` (#010102) is the anchor — never `#000`.
- Lavender-blue accent used scarcely (brand mark, focus, primary CTA, link emphasis).
- Four-step surface ladder carries hierarchy without shadow.
- Display tracking pulls aggressively negative; body holds near 0.
- Cards use 12px corners with 1px hairline borders.
- No second chromatic color, no atmospheric gradients, no spotlight cards.

## Colors

| Token | Hex | Use |
|---|---|---|
| `canvas` | #010102 | Page background |
| `surface-1` | — | Cards, panels, screenshot frames |
| `surface-2` | — | Featured / hovered cards |
| `surface-3` | — | Sub-nav, dropdowns |
| `surface-4` | — | Deepest lifted surface |
| `hairline` | #23252a | 1px borders, dividers |
| `hairline-strong` | — | Input focus borders |
| `primary` | #5e6ad2 | Primary CTA, brand, focus, links |
| `primary-hover` | #828fff | Hovered primary CTA |
| `primary-focus` | #5e69d1 | Focus ring tint |
| `ink` | #f7f8f8 | Headlines, emphasized body |
| `ink-muted` | #d0d6e0 | Secondary text |
| `ink-subtle` | #8a8f98 | Tertiary text, meta |
| `ink-tertiary` | #62666d | Disabled, footnotes |
| `success` | #27a644 | Status pills (only semantic) |

## Typography

Inter (fallback `SF Pro Display, -apple-system, system-ui`). Display weight 600 paired with body
400. Aggressive negative tracking on display; eyebrow uses slight positive tracking (+0.4px).

| Role | Size | Weight | Tracking |
|---|---|---|---|
| display-xl | 80px | 600 | -3.0px |
| display-md | 40px | 600 | -1.0px |
| headline | 28px | 600 | -0.6px |
| card-title | 22px | 500 | -0.4px |
| body | 16px | 400 | -0.05px |
| body-sm | 14px | 400 | 0 |
| caption | 12px | 400 | 0 |
| button | 14px | 500 | 0 |
| eyebrow | 13px | 500 | +0.4px |

## Shapes — Border Radius

| Token | Value | Use |
|---|---|---|
| md | 8px | Buttons, inputs |
| lg | 12px | Cards |
| xl | 16px | Product screenshot panels / viewer frame |
| pill / full | 9999px | Pills, avatars |

**Never pill-round buttons.**

## Elevation

Depth carried by surface ladder + hairline borders — the brand resists drop shadows on dark.
A subtle white top-edge highlight (`.edge-highlight`, inset 0 1px rgba(255,255,255,.04)) gives
lifted panels a faint rendered feel. No atmospheric gradients, no spotlight cards.

## Spacing

4px base. xxs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32 · xxl 48 · section 96.
Card interior padding lg 24px. Button padding 8px vertical · 14px horizontal.

## Do / Don't

**Do** — reserve `canvas` as anchor; use lavender only for brand/CTA/focus/links; use the
surface ladder for hierarchy; apply negative tracking on display; CTAs at 8px corners.

**Don't** — ship a light mode; use lavender as a card/section fill; introduce a second chromatic
accent; add atmospheric gradients or spotlight cards; pill-round CTAs; use `#000` as canvas.

## App mapping (24h Stories)

- **Story bar** → `surface-1` strip on canvas, 1px hairline bottom border, horizontal scroll.
- **Add `+` button** → primary lavender fill (hover `primary-hover`), full-round, avatar-sized.
- **Unseen ring** → 2px lavender gradient ring; seen collapses to flat `hairline` ring.
- **Timestamp** → `ink-subtle`, caption 12px.
- **Viewer** → pure-black scrim; image framed at 16px; progress segments `ink` low-opacity with
  solid `ink` fill; icon buttons transparent with `ink`.
- **Empty state** → centered `ink-tertiary` hint on bare canvas.
