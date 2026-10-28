# YumQuick design system

Tokens live in `src/theme.ts`; primitives in `src/components/ui.tsx`; icons in `src/components/icons.tsx`.

## Color — committed strategy
| Token | Hex | Use |
|---|---|---|
| `yellow` | #F5CB58 | Header band, launch, status screens |
| `red` | #E95322 | Primary buttons, tab bar, cart/profile drawers, fills, icons |
| `redText` | #C23D16 | Small red text on light surfaces (brand red is only 3.5:1) |
| `redDeep` | #9A2E0E | Text on yellow |
| `cream` | #F3E9B5 | Inputs, category bubbles |
| `blush` | #FFDECF | Secondary pills / buttons |
| `surface` | #F8F8F8 | Content sheet |
| `ink` / `inkSoft` | #391713 / #6B4A45 | Text |

Rule: never white text on yellow (1.5:1). Titles on yellow are `ink`.

## Type
League Spartan 400/500/600/700. Scale: display 34 · title 26 · h2 21 · h3 17 · body 15 · small 13. Letter-spacing no tighter than -0.5.

## Shape
Screen = yellow header + surface sheet with 30px top radius overlapping by 24px, red tab bar with 30px top radius. Images 20px radius, inputs 14px, buttons full pill. Drawers slide from the right with a 40px leading radius.

## Icons
Stroke icons from `assets/icons/parenticon.html` (5-unit stroke on a ~72-unit box), plus a few drawn on the same grid (categories, cloche, clipboard, star, chevrons). Use `<Icon name size color fill? />`.

## Motion
Ease-out-quint (`0.22, 1, 0.36, 1`). Drawers 380ms in / 240ms out. Press = scale 0.97 (opacity only under reduced motion). List items fade-up with ≤250ms stagger. Promo carousel auto-advances every 4.5s unless reduced motion is on.

## Touch
Every tappable target ≥44pt via size or `hitSlop`. Every icon-only control has an accessibility label.
