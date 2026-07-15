# ContinueCard

A presentational "pick up where you left off" card for surfacing a single
in-progress course, module, lesson, or session. Built on `SectionCard` and
`ProgressMeter`.

## When to use

Pick the `variant` from what the card IS on its surface — it decides icon
placement, CTA affordance, and accent together, so a surface can't end up with
an arbitrary mix of the three.

| | `variant="item"` | `variant="hero"` |
|---|---|---|
| **Use when** | one of N resume cards in a grid/list | the single standout "you left this in progress" card |
| **Icon** | small round badge leading the row | watermark sunk behind the content |
| **CTA** | plain accent text; the whole card is one tap target | real chip button on its own row |
| **Accent ring** | no — N accented cards means none stands out | yes — it IS the highlighted thing |
| **Real callers** | `ResumeCard` (dashboard grid) | `DueReviewHero`, `QuizSession`, `MockInterviewSession` |

- The `ProgressMeter` renders **iff `value` is provided**. Pass it only when real
  progress data exists — omit it rather than passing a placeholder like `0` to
  satisfy the type. A card for something never started shows no meter.
- Do NOT use for grids of many *unstarted* items — `MediaCard` is the right shape.

## Props table

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"item" \| "hero"` | — (required) | What the card is on its surface — see the table above. Required so the shape is a single decision, not a mix of flags. |
| `title` | `React.ReactNode` | — (required) | Primary label of the item. Truncated to one line. |
| `subtitle` | `React.ReactNode` | `undefined` | Secondary label under the title (module name, position in session). Truncated to one line. |
| `value` | `number` | `undefined` | Current progress. The `ProgressMeter` renders iff this is provided. |
| `max` | `number` | `100` | Maximum value representing 100 % completion. Forwarded to `ProgressMeter`. |
| `ctaLabel` | `React.ReactNode` | `undefined` | Call-to-action label. Accent text for `item`, chip button for `hero`. |
| `icon` | `React.ReactNode` | `undefined` | Semantic momentum cue (e.g. `FireIcon` for a streak, `ClockCounterClockwiseIcon` for a session mid-flight). Placement follows `variant`. Decorative for a11y. Omit when the item has no such concept — never add one for visual symmetry. |
| `urgent` | `boolean` | `false` | Renders `subtitle` in warning tone — only for a REAL server-enforced deadline already stated in the subtitle text. Never fabricate a countdown to trigger this (`principles/persuasion-psychology`: no fake scarcity). |
| `onPress` | `() => void` | `undefined` | `item`: the whole card becomes the button. `hero`: wires to the CTA chip. Prefer `href` for navigation. |
| `href` | `string` | `undefined` | Destination URL. Takes priority over `onPress`. |
| `className` | `string` | `undefined` | Applied to the outermost element for caller placement (width, margin, grid area). |

## Usage

```tsx
import { BookOpenIcon } from "@phosphor-icons/react"
import { ContinueCard } from "@/components/blocks/cards"

// one of N in the dashboard grid — no meter (nothing measured yet)
<ContinueCard
    variant="item"
    icon={<BookOpenIcon weight="fill" />}
    title="Module 3 — API Design"
    subtitle="Bài đọc"
    ctaLabel="Tiếp tục"
    href="/courses/fullstack-mastery/modules/3/lessons/2"
/>
```

```tsx
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"

// the single session left mid-flight, with real progress + a real deadline
<ContinueCard
    variant="hero"
    icon={<ClockCounterClockwiseIcon weight="fill" />}
    title="Phỏng vấn thử: Rate Limiter"
    subtitle="Câu 5 / 8 · còn 12 phút"
    urgent
    value={5}
    max={8}
    ctaLabel="Tiếp tục"
    onPress={resume}
/>
```

## Composes

- **`SectionCard`** (`@/components/reuseable`) — the bordered, flat-no-shadow card frame (3xl radius, padded body). `ContinueCard` never hand-writes `rounded`, `border`, or `bg-*`. `variant="hero"` forwards its `accent` prop (a `border-accent` ring, never a background flood — see `principles/accent-system` §3/§5).
- **`ProgressMeter`** (`@/components/blocks/stats`) — the labelled accessible progress bar.
- **`Typography`** (`@heroui/react`) — all text nodes; no raw `<span>` with text utilities.
- **`WithClassNames`** (`@/modules/types/base/class-name`) — supplies `className`.

## Notes

- **Interactivity differs by variant.** HeroUI v3 `Card` has no `isPressable`. For
  `item`, `ContinueCard` wraps `SectionCard` in a real `<a>`/`<button>` so the
  whole surface is one tap target. For `hero`, the CTA's own `Button`/`Link` is
  the one real interactive element and the card is NOT also wrapped — that would
  nest two interactive controls. So in `hero`, only the chip responds to a click.
- **`className` placement.** For an interactive `item`, `className` lands on the
  outer `<a>`/`<button>` (the true outermost element). Otherwise it lands on
  `SectionCard`.
- **Colour exceptions.** `text-accent-soft-foreground` (CTA text) and
  `text-warning-soft-foreground` (`urgent` subtitle) come through `className`
  because HeroUI `Typography`'s `color` prop only offers `default`/`muted`.
- **`icon` is `aria-hidden`** in both placements — `title` already carries the
  accessible name.
