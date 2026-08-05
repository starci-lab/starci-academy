# StatusChip

A tier-3 presentational block — a small, pill-shaped semantic status indicator built on HeroUI `Chip` that maps a named tone to a chip color and optionally renders a leading icon.

## When to use

- Use when you need to surface a status, state, or category tag (e.g. "Active", "Pending", "Error") in a compact inline format.
- Use when the status meaning maps cleanly to one of the five semantic tones (`neutral`, `success`, `warning`, `danger`, `accent`).
- **Do not use** when the chip must be interactive (clickable/dismissible) — reach for HeroUI `Chip` directly with `onClose` or `onPress`.
- **Do not use** when you need a full badge with counters or avatars; consider `AvatarChip` or a raw HeroUI `Badge` instead.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger" \| "accent"` | `"neutral"` | Semantic tone that drives the chip color. `neutral` maps to HeroUI `default`. |
| `icon` | `ReactNode` | `undefined` | Optional leading icon rendered before the label (e.g. a `@gravity-ui/icons` icon). Dropped when `onCancel` is set. |
| `children` | `ReactNode` | — (required) | Label content rendered inside `Chip.Label`. |
| `onCancel` | `() => void` | `undefined` | When set, renders a trailing cancel-× (via `ElementCloseButton`) instead of the leading `icon`. |
| `cancelLabel` | `string` | `undefined` | Accessible label for the cancel button (pass an already-localised string). |

Does **not** take `className` — this is a block-tier component (canon BLOCK-4). A caller that needs
to place the chip inside a specific layout composes a frame (`StackH`/`Cluster`/…) around it instead
of styling the chip itself.

## Usage

```tsx
import React from "react"
import { ArrowRotateLeft } from "@gravity-ui/icons"
import { StatusChip } from "@/components/blocks"
import { Cluster } from "@/components/frames/Cluster"

export const LessonStatus = () => (
    <Cluster
        gap={3}
        items={[
            () => <StatusChip tone="success">Completed</StatusChip>,
            () => (
                <StatusChip tone="warning" icon={<ArrowRotateLeft width={12} height={12} />}>
                    In Review
                </StatusChip>
            ),
            () => <StatusChip tone="danger">Failed</StatusChip>,
            () => <StatusChip tone="accent">New</StatusChip>,
            () => <StatusChip>Draft</StatusChip>,
        ]}
    />
)
```

Wrap chips in a frame (`Cluster` above, or `StackH`) for row layout — never a raw
`<div className="flex gap-*">` and never a `className` passed into the chip itself.

## Composes

- **HeroUI `Chip`** — root element; always rendered with `variant="soft"` and `size="sm"`.
- **`ElementCloseButton`** (`@/components/blocks/buttons/ElementCloseButton`) — the trailing
  cancel-× rendered when `onCancel` is set; takes `tone` and `classNames={["shrink-0"]}`.

No other blocks or reuseable modules are composed.

## Notes

- The chip is always `size="sm"` and `variant="soft"` — these are hard-coded and not overridable via props.
- `rounded-full` is applied unconditionally; do not counteract it with a conflicting border-radius class.
- The `icon` node is rendered **before** `Chip.Label` inside the chip. Size it to match `sm` chip height — `width={12} height={12}` (12 px) is a safe default for `@gravity-ui/icons`.
- Do not pass phosphor icons — phosphor is not installed. Use `@gravity-ui/icons` for generic icons and `@icons-pack/react-simple-icons` for brand logos.
- This block holds no internal state and performs no data fetching. The only callback it fires is
  `onCancel`, for a removable/filter chip's trailing cancel-×.
- Accessibility: the chip renders as a `<span>` by default (HeroUI). If the status must be announced to screen readers in context, wrap it with an `aria-label` on a parent or add a visually-hidden description alongside it.
- Does not take `className` (block tier, canon BLOCK-4) — place it via a frame around it, not a
  class merged onto it.
