# ContinueCard

A presentational "pick up where you left off" card for surfacing a single
in-progress course, module, lesson, or session. Built on `SectionCard`,
`HighlightCard`, `SeeMoreLink`, and `ProgressMeter`.

## When to use

Pick the `variant` from what the card IS on its surface — it decides icon
placement, CTA affordance, and accent together, so a surface can't end up with
an arbitrary mix of the three.

| | `variant="item"` | `variant="hero"` |
|---|---|---|
| **Use when** | one of N resume cards in a grid/list | the single standout "you left this in progress" card |
| **Icon** | none — a compact tile reads off its title + "Continue →" | watermark sunk behind the content (`icon` prop) |
| **CTA** | a real `SeeMoreLink` ("Continue →") on its own row; hover + click live on that link only | a filled chip button/link on its own row |
| **Accent ring** | no — N accented cards means none stands out | yes — wrapped in `HighlightCard` |
| **Real callers** | `ResumeCard` (dashboard grid) | `DueReviewHero`, `QuizSession`, `MockInterviewSession`, `PersonalProjectDashboard` |

- The `ProgressMeter` renders **iff `value` is provided**. Pass it only when real
  progress data exists — omit it rather than passing a placeholder like `0` to
  satisfy the type. A card for something never started shows no meter.
- Do NOT use for grids of many *unstarted* items — `MediaCard` is the right shape.
- `icon` is a no-op on `variant="item"` — it only ever renders for `hero`.

## Props table

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"item" \| "hero"` | — (required) | What the card is on its surface — see the table above. Required so the shape is a single decision, not a mix of flags. |
| `title` | `React.ReactNode` | — (required) | Primary label of the item. Truncated to one line. |
| `subtitle` | `React.ReactNode` | `undefined` | Secondary label under the title (module name, position in session). Truncated to one line. |
| `value` | `number` | `undefined` | Current progress. The `ProgressMeter` renders iff this is provided. |
| `max` | `number` | `100` | Maximum value representing 100 % completion. Forwarded to `ProgressMeter`. |
| `ctaLabel` | `React.ReactNode` | `undefined` | Call-to-action label. `SeeMoreLink` text for `item`, a filled chip for `hero`. |
| `icon` | `React.ReactNode` | `undefined` | Semantic momentum cue (e.g. `FireIcon` for a streak, `ClockCounterClockwiseIcon` for a session mid-flight). Rendered ONLY for `hero`, as a watermark. Decorative for a11y. Omit when the item has no such concept — never add one for visual symmetry. |
| `urgent` | `boolean` | `false` | Renders `subtitle` in warning tone — only for a REAL server-enforced deadline already stated in the subtitle text. Never fabricate a countdown to trigger this (`principles/persuasion-psychology`: no fake scarcity). |
| `onPress` | `() => void` | `undefined` | `item`: wires to the `SeeMoreLink` CTA. `hero`: wires to the CTA chip (ignored when `href` is set). Prefer `href` for navigation. |
| `href` | `string` | `undefined` | Destination URL. Takes priority over `onPress`. |
| `identity` | `CallerIdentity` | `undefined` | Caller identity (`{ tier, component }`) to wear on this card's root element instead of its own — pass this when a `block`/`layout`/`overlay`/`page` component is using this card AS its root, instead of wrapping it in a raw `data-tier=…`/`data-component=…` div. Lands on exactly one element: the underlying `SectionCard`, or the `Box` wrapping it when `hero`'s watermark is rendered. Omitted → that element keeps emitting its own identity, unchanged. See `_identity.ts`. |

No `className`/`classNames` — this is a block (BLOCK-4: no escape hatch). A caller
that needs a specific placement (width, margin, grid area) wraps `ContinueCard` in a
frame (`StackV`/`Grid`/…) instead. `ResumeCard`
(`@/components/features/dashboard/ContinueLearning/ResumeCard`) still forwards its
own `className` into this card as of this writing — a known follow-up outside this
folder, not a supported call shape going forward.

## Usage

```tsx
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"

// one of N in the dashboard grid — no meter (nothing measured yet)
<ContinueCard
    variant="item"
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

- **`SectionCard`** (`@/components/blocks/cards/SectionCard`) — the bordered,
  flat-no-shadow card frame (3xl radius, padded body). `ContinueCard` never
  hand-writes `rounded`, `border`, or `bg-*`.
- **`HighlightCard`** (`@/components/blocks/cards/HighlightCard`) — wraps the
  `hero` card in the sweeping-light accent layer; `item` is never wrapped (N
  accented cards would cancel each other's emphasis out).
- **`SeeMoreLink`** (`@/components/blocks/navigation/SeeMoreLink`) — the
  "Continue →" affordance for `item`'s CTA.
- **`ProgressMeter`** (`@/components/blocks/stats/ProgressMeter`) — the labelled
  accessible progress bar.
- **`Typography`** (`@/components/atoms/text/Typography`) — all text nodes; no
  raw `<span>`/`<p>` with text utilities.
- **`Button`** (`@/components/atoms/buttons/Button`) — the `hero` CTA when it
  fires `onPress` (no `href`).

## Notes

- **Interactivity differs by variant.** For `item`, the CTA is a real
  `SeeMoreLink` on its own row — hover + click live on that link only, the card
  itself stays a static, non-interactive frame. For `hero`, the CTA's own
  chip is the one real interactive element (never nest two interactive
  controls inside one card).
- **The `hero` href CTA is a minimal local anchor, not an atom.** No atom/leaf in
  the tree renders a filled, pill-shaped *navigational* link — `Button` (atom)
  only takes `onPress`, and `SeeMoreLink` renders plain accent text, not a
  filled chip. Flagged as missing vocabulary rather than silently hand-rolled
  as a permanent shape; kept minimal and local until an atom exists for it.
- **The `hero` watermark needs positioning `SectionCard` doesn't expose.**
  `SectionCard` has no relative/overflow control and no decorative-overlay
  slot, so `ContinueCard` wraps it in the frame tier's `Box` escape hatch
  (`relative overflow-hidden rounded-3xl`) only when `hero` actually renders an
  `icon` — never for `item`, and never by editing `SectionCard` itself.
- **`urgent`'s tone is the nearest available token, not the old exact one.**
  `Typography`'s `color` union offers `warning` but not a `warning-soft`
  foreground variant, so `urgent` reads `color="warning"` instead of the old
  hand-picked `text-warning-soft-foreground`.
- **`icon` is `aria-hidden`** — `title` already carries the accessible name.
