# PricingCard

A tier-3 presentational block that renders a single pricing plan card with a tier name, price row, feature list, and a call-to-action button — all content is received via props, no data-fetching or store access inside.

## When to use

- Use when building a pricing / subscription page that lists multiple plans side-by-side.
- Use when you need a self-contained card where the parent controls price formatting, currency, feature list markup, and button configuration.
- **Do not use** when the card must also fetch its own data — compose it inside a container that owns the SWR/Redux call and passes values down.
- **Do not use** for generic content cards; use `SectionCard` (reuseable) directly for simple titled sections, or `MediaCard` (block) for image-first cards.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `React.ReactNode` | — | Display name of the pricing tier (e.g. "Pro"). |
| `price` | `React.ReactNode` | — | Current price, rendered large (e.g. "$9"). |
| `originalPrice` | `React.ReactNode` | `undefined` | Strike-through original price to show a discount. Omit to hide. |
| `period` | `React.ReactNode` | `undefined` | Muted billing period label (e.g. "/month"). Omit if not applicable. |
| `features` | `React.ReactNode` | — | Feature list — typically a `<ul>` element. Caller controls markup. |
| `cta` | `React.ReactNode` | — | Call-to-action button — pass a fully configured HeroUI `<Button>`. |
| `badge` | `React.ReactNode` | `undefined` | Optional badge (e.g. "Phổ biến") shown beside the tier name. Only when `highlighted`. Chip is `w-fit` — never full-width. |
| `highlighted` | `boolean` | `false` | Enables accent border/background (SectionCard `accent` variant) and reveals the badge. |

## Usage

```tsx
import React from "react"
import { Button } from "@heroui/react"
import { PricingCard } from "@/components/blocks"

const FreePlan = () => (
    <PricingCard
        name="Free"
        price="$0"
        period="/month"
        features={
            <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                <li>50 AI credits / month</li>
                <li>Access to all free lessons</li>
            </ul>
        }
        cta={<Button className="w-full" variant="bordered">Get started</Button>}
    />
)

const ProPlan = () => (
    <PricingCard
        name="Pro"
        price="$9"
        originalPrice="$19"
        period="/month"
        badge="Most popular"
        highlighted
        features={
            <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                <li>500 AI credits / month</li>
                <li>All courses unlocked</li>
                <li>Priority support</li>
            </ul>
        }
        cta={<Button className="w-full" color="accent">Upgrade now</Button>}
    />
)
```

## Composes

- **`SectionCard`** (`@/components/blocks/cards/SectionCard`) — outer card frame with optional accent variant.
- **`Typography`** (`@/components/atoms/text/Typography`) — name, price, original price (`isStruck`), and period.
- **`Chip`** (`@/components/atoms/chips/Chip`) — the `highlighted`-only badge (`tone="accent"`).
- **`StackH`** (`@/components/frames/Stack`) — the name+badge row and the price row (both wrap below `sm`).
- **`StackV`** (`@/components/frames/Stack`) — the `flex-1` wrapper around `features` so it grows and the CTA pins to the bottom.

## Notes

- The `badge` is only rendered when **both** `badge` and `highlighted` are truthy — a non-highlighted card never shows its badge even if `badge` is set.
- Pass a `w-full` class on the `<Button>` CTA for consistent full-width appearance across tiers.
- `features` is an opaque `ReactNode` — the block applies no list styles itself. Use Tailwind utilities on your own `<ul>/<li>` for icons, spacing, and color.
- Spacing follows the project scale: `gap-6` between major sections (via `SectionCard`'s `contentClassName`), `gap-2` within the name/price rows (`StackH gap={3}`).
- The name+badge row and the price row wrap onto a second line below the `sm` container step (`StackH at="sm"`), so long price strings (e.g. localised VND amounts) reflow gracefully on narrow viewports.
- `PricingCard` takes no `className`/`classNames` (block tier, BLOCK-4) — where it sits inside a layout (e.g. `flex-1` in a row of tiers) is the caller's frame's job, not this block's.
- Accessible: the badge chip carries no ARIA role; if you need it announced as a status, wrap the caller's row in `role="status"`.
