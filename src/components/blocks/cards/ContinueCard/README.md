# ContinueCard

A presentational "pick up where you left off" card for surfacing a single
in-progress course, module, or lesson with a progress bar and an optional
call-to-action label. Built on `SectionCard` and `ProgressMeter`.

## When to use

- Use on dashboard / home pages to highlight the learner's most recent item.
- Use in course detail pages to surface the next unfinished lesson.
- Use whenever you need a compact, progress-aware card that links to one item.
- Do NOT use for items that have not been started (progress = 0 reads oddly as a ContinueCard — prefer a `MediaCard` without a progress footer).
- Do NOT use for grids of many items — `MediaCard` is the right shape for that.

## Props table

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `React.ReactNode` | — (required) | Primary label of the item (course / lesson title). Truncated to one line. |
| `value` | `number` | — (required) | Current progress value forwarded to `ProgressMeter`. Should be in `[0, max]`. |
| `cover` | `React.ReactNode` | `undefined` | Optional media node (thumbnail, course icon) rendered flush-left, shrink-0. |
| `subtitle` | `React.ReactNode` | `undefined` | Secondary label under the title (module name, lesson number). Truncated to one line. |
| `max` | `number` | `100` | Maximum value representing 100 % completion. Forwarded to `ProgressMeter`. |
| `ctaLabel` | `React.ReactNode` | `undefined` | Call-to-action label pinned to the far right (e.g. "Continue"). |
| `ctaVariant` | `"text" \| "chip"` | `"text"` | `"text"` — plain accent-coloured label; the whole card is wrapped in a real `<a>`/`<button>` via `href`/`onPress`, one tap target. `"chip"` — renders a REAL HeroUI `Button` (`variant="primary"`, which this app's theme maps to `--accent`/`--accent-foreground`) or `Link` (when `href` is used) with a trailing `ArrowRightIcon` — native hover/focus/keyboard, not a hand-rolled `<span>`. In this mode the card itself is NOT also wrapped in an outer `<a>`/`<button>` (would nest two interactive controls) — `href`/`onPress` apply directly to the CTA control. |
| `onPress` | `() => void` | `undefined` | `ctaVariant="text"`: whole card wrapped in a `<button>`. `ctaVariant="chip"`: wired directly to the CTA's own `Button`. Prefer `href` for navigation. |
| `href` | `string` | `undefined` | `ctaVariant="text"`: whole card wrapped in an `<a>`. `ctaVariant="chip"`: wired directly to the CTA's own `Link`. Takes priority over `onPress`. |
| `urgent` | `boolean` | `false` | Renders `subtitle` in warning tone instead of muted — for a REAL time-sensitive fact in the subtitle text (e.g. a server-enforced deadline countdown). Never set this off a fabricated/decorative countdown — see `principles/persuasion-psychology` (no fake scarcity). |
| `badgeIcon` | `React.ReactNode` | `undefined` | Small circular tinted badge leading the info row (same slot family as `cover`, round + `bg-accent/10 text-accent`) — a SEMANTIC momentum cue (e.g. `FireIcon` for a daily streak/practice queue, matching `UserStreak`'s navbar icon language — NOT `FlameIcon`, reserved for difficulty per `components/card.md` §5). Omit when the resume item has no such concept (e.g. a one-off mock-interview session) — never add one just for visual symmetry. Mutually exclusive with `watermarkIcon` — pick one per usage. |
| `watermarkIcon` | `React.ReactNode` | `undefined` | Large decorative icon bled off the bottom-right corner (`absolute`, `text-accent opacity-40`, `aria-hidden`, `pointer-events-none`, `size-32`), sunk behind the content instead of an inline badge. Tuned up from an initial `opacity-15`/`size-24` pass — rejected as unreadable in a live screenshot ("đồng hồ chả ai thấy"). Use for a "resume this in-progress session" cue when the caller wants it sunk into the background rather than an inline `badgeIcon` (e.g. `ClockCounterClockwiseIcon` for the flashcard resume cards). Pairs well with `ctaBelow` (frees the row's right side). Never affects layout or a11y. |
| `accented` | `boolean` | `false` | Forwards `SectionCard`'s own `accent` prop — a `border-accent` ring, NOT a background fill. The canonical "highlighted/mine" card treatment (`principles/accent-system` §3). Do NOT reach for a `bg-accent/5..15` flood on the whole card instead — that's the documented ACCENT-FLOOD anti-pattern (§5), already caught and fixed elsewhere in the app. |
| `ctaBelow` | `boolean` | `false` | Moves `ctaLabel` out of the info row into its own full-width row below the title/subtitle, instead of pinned to the far right of that row. Use when the info row's right side needs to stay clear (e.g. for a `watermarkIcon`) or the inline-right CTA reads cramped once `hideProgress` removes the meter that used to anchor it. |
| `hideProgress` | `boolean` | `false` | Omits the `ProgressMeter` entirely — `value`/`max` are unused. For a resume card where the bar read as clutter rather than useful signal ("nhìn phèn phèn" — a busy/cheap look — on the flashcard resume cards). |
| `className` | `string` | `undefined` | Applied to the outermost element for caller placement (width, margin, grid area). |

## Usage

```tsx
import React from "react"
import { ContinueCard } from "@/components/blocks/cards"

export const DashboardContinue = () => (
    <ContinueCard
        href="/courses/fullstack-mastery/modules/3/lessons/2"
        cover={
            <img
                src="/thumbnails/fullstack.webp"
                alt=""
                className="h-12 w-12 rounded-lg object-cover"
            />
        }
        title="Module 3 — API Design"
        subtitle="Lesson 2: REST vs GraphQL"
        value={40}
        max={100}
        ctaLabel="Continue"
    />
)
```

A resume card that wants a more CTA-forward, less busy look (e.g. a session left in progress) drops the progress meter, moves the CTA below, and sinks a `watermarkIcon` behind the content:

```tsx
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"

<ContinueCard
    title="Review in progress"
    subtitle="Card 4/20"
    value={4}
    max={20}
    hideProgress
    ctaLabel="Continue"
    ctaVariant="chip"
    ctaBelow
    accented
    watermarkIcon={<ClockCounterClockwiseIcon weight="fill" />}
    href="/courses/fullstack-mastery/learn/flashcards/review/sessions/abc123"
/>
```

## Composes

- **`SectionCard`** (`@/components/reuseable`) — supplies the bordered, flat-no-shadow card frame with 3xl radius and padded body. `ContinueCard` never hand-writes `rounded`, `border`, or `bg-*`.
- **`ProgressMeter`** (`@/components/blocks/stats`) — renders the labelled accessible progress bar beneath the info row.
- **`Typography`** (`@heroui/react`) — all text nodes use `Typography` props (weight, type, color, truncate) — no raw `<div>`/`<span>` with text utility classes.
- **`WithClassNames`** (`@/modules/types/base/class-name`) — base interface that supplies `className`.

## Notes

- **Interactivity wrapper pattern (`ctaVariant="text"` only).** HeroUI v3 `Card` / `SectionCard` has no `isPressable`, `onPress`, or `href` prop. `ContinueCard` wraps the `<SectionCard>` in a real `<a>` (for `href`) or `<button>` (for `onPress`) so the entire card surface is one accessible tap/click target. When neither prop is provided the card is a static surface.
- **`ctaVariant="chip"` has no card-level wrapper.** The CTA's own `Button`/`Link` is the one real interactive element (native hover via this app's `--accent-hover` token, focus ring, keyboard activation) — `SectionCard` receives `className` directly and is otherwise a static surface around it. Don't also pass `onPress`/`href` expecting a whole-card click in this mode — only the CTA control responds.
- **`className` placement.** For `ctaVariant="text"` when the card is interactive, `className` is placed on the outer `<a>` / `<button>` wrapper — not on `SectionCard` — so layout constraints (width, margin, grid area) apply to the true outermost element. For `ctaVariant="chip"`, `className` always lands on `SectionCard` itself (no outer wrapper exists).
- **Truncation via prop.** Both `title` and `subtitle` use the `truncate` prop on `Typography` (not `className="truncate"`), as required by LAW 2.
- **`ctaLabel` colour.** The `text-accent` class on the CTA `Typography` (`ctaVariant="text"`) is the one allowed `className` colour exception per LAW 1 — the HeroUI `color` prop lacks an "accent" token for body text. `ctaVariant="chip"` uses HeroUI `Button`/`Link` with `variant="primary"` (this app's theme maps `button--primary` to `--accent`/`--accent-foreground` in `button.css`) — same pairing `SitePreview`'s solid accent pill uses, but via the real component instead of a hand-styled `<span>`.
- **`urgent` colour.** Same exception as `ctaLabel` — `text-warning` via `className` (HeroUI `Typography`'s `color` prop only has `"default"`/`"muted"`, no semantic tones). Grounded example: Mock Interview's resume card turns the subtitle warning-toned once the server-enforced 1-hour session deadline is close, mirroring a REAL countdown — never fabricate one just to look urgent.
- **Spacing.** The card body uses `gap-3` (same-function items, per the project spacing-scale convention). The info row uses `gap-3` between cover, text column, and CTA.
- **`cover` sizing.** Size and shape of the cover node (rounded corners, aspect ratio) are the caller's responsibility — pass fully styled nodes.
- **Accessibility.** `ctaVariant="text"`: when `href` is set, the outer `<a>` has no extra `aria-label`; ensure `title` is descriptive enough to serve as the link label. When `onPress` is used, the `<button>` gets `type="button"` and `text-left`. `ctaVariant="chip"`: the CTA `Button`/`Link` carries its own accessible name from `ctaLabel` — no nested-interactive-control violation since the card is no longer separately wrapped.
- **`badgeIcon` is `aria-hidden`.** It sits alongside `title` (which already carries the link label) — decorative from an a11y standpoint even though it's semantically meaningful visually.
