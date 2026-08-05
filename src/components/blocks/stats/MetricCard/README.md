# MetricCard

A standalone, framed single-metric display built on `SectionCard` — a tier-3 presentational block that receives all content via props and performs no data fetching or store access.

## When to use

- Use when you need a **self-contained card** showing one key metric (value + label) in a grid or sidebar — e.g. dashboard KPI tiles, profile stats overview.
- Use when the metric card needs its **own visual frame** (border + background from `SectionCard`) and stands alone rather than beside dividers.
- **Do NOT use** for inline stat strips or ribbons — prefer [`StatPair`](../StatPair/index.tsx) there, which is frameless and designed to sit inside a `StatRibbon`.
- **Do NOT use** when you need progress visualization — prefer [`ProgressMeter`](../ProgressMeter/index.tsx) for that.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `React.ReactNode` | **required** | The primary metric value (e.g. `"1,204"`, `"98%"`). Rendered `Typography size="h4" weight="semibold"`. |
| `label` | `React.ReactNode` | **required** | Short description of what the value measures. Rendered `Typography size="sm"`, the prominent line right below the value. |
| `hint` | `React.ReactNode` | — | Optional supplementary note (e.g. `"Updated daily"`). Rendered `Typography size="xs" color="muted"` beneath the label — a quiet footnote, deliberately less prominent than the label. |
| `classNames` | `Array<AllowedClassName>` | — | Where this card sits inside its parent (flex/grid child behavior). Forwarded to `SectionCard`'s own `classNames`. Appearance is not passable — there is no `className` escape hatch (BLOCK-4). |

## Usage

```tsx
import React from "react"
import { MetricCard } from "@/components/blocks/stats/MetricCard"

export const EnrollmentKpi = () => (
    <MetricCard
        value="1,204"
        label="Total Enrollments"
        hint="Updated daily"
    />
)
```

## Composes

- `SectionCard` from `@/components/blocks/cards/SectionCard` — supplies the card frame (border, background, radius, padding).
- `Typography` from `@/components/atoms/text/Typography` — renders the value/label/hint lines.
- `StackV` from `@/components/frames/Stack` — the vertical `gap-2` track between the three lines.

## Notes

- **No frame duplication**: `SectionCard` already provides the card frame. Do not wrap `MetricCard` in another card.
- **No icon slot**: removed 2026-07-16 — a leading icon read as competing with the label for prominence. `SectionCard`'s own `icon` prop remains available for a HEADER icon if a future case needs one; `MetricCard` does not thread it through today (missing vocabulary — no local wrapper was needed since no caller currently uses one).
- **Token rules**: value/label/hint route through `Typography`'s `size`/`color` scale — there is no ad-hoc `text-[Npx]` anywhere in this block.
- **`hint` vs `label`**: `label` describes *what* the metric is; `hint` adds *context* (source, freshness, comparison). Keep both short — a single line each.
