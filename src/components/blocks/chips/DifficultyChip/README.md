# DifficultyChip

A small tier-coloured dot + label that communicates content difficulty. Folder path is
`blocks/chips` for import-compatibility, but the component takes no domain entity and
owns no async state — it is really a **composite** (BLOCK-7: no data, no loading/error
decision), and follows that tier's rules internally (no `className`, `classNames:
Array<AllowedClassName>` instead; composes through the house `Typography` atom).

## When to use

- **Display a difficulty tag** on a lesson card, challenge card, or list row where the user needs to gauge effort at a glance.
- **Render a static label** alongside a challenge or course title in any layout that needs a compact, colored indicator.
- **Do NOT use** when you need an interactive filter control — reach for a `<Chip>` wrapped in a toggle or a `FilterBar` block instead.
- **Do NOT use** for generic category labels or status badges unrelated to difficulty — use a plain `<Chip>` with an explicit color.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `difficulty` | `"beginner" \| "intermediate" \| "advanced" \| "insane"` | — **(required)** | Difficulty level to display. Drives the dot color automatically. |
| `label` | `string` | capitalized `difficulty` string | Override the visible text beside the dot. |
| `classNames` | `Array<AllowedClassName>` | `undefined` | Position-only classes on the root `<span>` (composite tier — no raw `className`). |

## Usage

```tsx
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"

// Default label ("Intermediate")
<DifficultyChip difficulty="intermediate" />

// Custom label
<DifficultyChip difficulty="advanced" label="Hard" />
```

## Composes

- **`Typography`** atom (`@/components/atoms/text/Typography`) — `size="xs"` `color="muted"` for the label text.
- The dot stays a raw `<span>` — no swatch/dot atom exists yet in `atoms/` (same gap `composites/text/DotLabel` and `composites/stats/Legend` already flag). Considered reusing `DotLabel` directly (same "colour dot + label, no pill" shape); not reused because its fixed `size="sm"` / `gap-1` / `size-2.5` dot renders one step larger than this component's `xs` / `gap-2` / `size-3` dot, and swapping would change the pixels at every existing call site.

## Notes

- **Color mapping** is hard-coded and intentional: `beginner → emerald`, `intermediate → amber`, `advanced → orange`, `insane → rose` — a sequential Tailwind ramp (hottest = hardest), not the 5 semantic chip tones. Do not override via a `color`/`tone` prop — pass the correct `difficulty` instead.
- **`classNames` goes on the root `<span>`**. If you need to style the text, pass a `<span>` as the `label` prop.
- **Accessibility**: renders as a plain `<span>` wrapping an `aria-hidden` dot + the label text. If the difficulty label is the only contextual cue in a given UI, add a visually-hidden `aria-label` on the surrounding container to give screen-reader users the same information.
- **No internal state** — purely driven by props; safe to render in SSR and inside `React.memo` wrappers.
