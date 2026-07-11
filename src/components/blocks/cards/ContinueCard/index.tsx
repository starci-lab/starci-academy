"use client"

import React from "react"
import { Button, Link, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"

/**
 * Props for the {@link ContinueCard} block.
 *
 * A presentational, props-only card that lets the caller surface a single
 * "continue where you left off" item — a course, module, or lesson — with
 * a progress bar and an optional call-to-action label.
 *
 * All interactivity is delivered by the caller via {@link onPress} or
 * {@link href}; the block itself performs no data fetching and reads no
 * global store.
 */
export interface ContinueCardProps extends WithClassNames<undefined> {
    /**
     * Optional media node rendered flush on the left of the info row — typically
     * a `<img>` thumbnail or course icon (renders shrink-0 so it never
     * compresses).
     */
    cover?: React.ReactNode
    /**
     * Primary label of the item being continued (course / module / lesson title).
     * Rendered via {@link Typography} weight="medium", truncated to one line.
     */
    title: React.ReactNode
    /**
     * Optional secondary label shown under the title — e.g. module name,
     * lesson number, or author. Rendered via {@link Typography} type="body-xs"
     * color="muted", truncated to one line.
     */
    subtitle?: React.ReactNode
    /**
     * Current progress value. Forwarded directly to {@link ProgressMeter}.
     * Should fall within `[0, max]`.
     */
    value: number
    /**
     * Maximum value representing 100 % completion. Defaults to `100`.
     * Forwarded to {@link ProgressMeter}.
     */
    max?: number
    /**
     * Optional call-to-action label rendered to the far right of the info row
     * (e.g. "Continue", "Resume"). Rendered via {@link Typography} type="body-sm"
     * with `text-accent` so it stands out as a navigational affordance.
     */
    ctaLabel?: React.ReactNode
    /**
     * Optional press handler. With `ctaVariant="text"` (default), the whole
     * card is wrapped in a `<button>` so the entire surface is one accessible
     * tap target. With `ctaVariant="chip"`, this is instead wired directly to
     * the CTA's own `Button` — the card itself is not separately wrapped (see
     * {@link ctaVariant}). Prefer {@link href} for pure navigation.
     */
    onPress?: () => void
    /**
     * Optional destination URL. With `ctaVariant="text"` (default), the card
     * is wrapped in an `<a>` anchor — the whole surface becomes a single
     * accessible link. With `ctaVariant="chip"`, this is instead wired
     * directly to the CTA's own `Link`. Takes priority over {@link onPress}.
     */
    href?: string
    /**
     * Renders `subtitle` in `warning` color instead of the default muted tone —
     * for when the subtitle carries a REAL time-sensitive fact (e.g. "còn 12
     * phút" against a server-enforced deadline), not decorative urgency.
     * Never fabricate a countdown to trigger this — see
     * `principles/persuasion-psychology` (no fake scarcity/countdown).
     * Defaults to `false` (current muted look, unchanged for existing callers).
     */
    urgent?: boolean
    /**
     * Optional small circular badge icon rendered leading the info row (before
     * the text column, same slot family as `cover` but round + tinted) — a
     * semantic momentum cue (e.g. `FireIcon` for a daily streak/practice queue),
     * NOT a generic illustration. `aria-hidden` (decorative alongside `title`).
     * Omit when the resume item has no such momentum concept (e.g. a one-off
     * mock-interview session) — never force one on for visual symmetry alone.
     */
    badgeIcon?: React.ReactNode
    /**
     * Optional decorative icon sunk behind the content as a large, low-opacity
     * watermark bled off the bottom-right corner (`absolute`, `text-accent
     * opacity-40`, `aria-hidden`, `pointer-events-none` — never affects
     * layout/a11y). An alternative to `badgeIcon` for the same momentum concept
     * when the caller wants it sunk into the background rather than an inline
     * badge. Tuned up from an initial `opacity-15`/`size-24` pass (thầy
     * 2026-07-11: "đồng hồ chả ai thấy" — too faint/small to register as its
     * actual shape) to `opacity-40`/`size-32`. Bottom-right — pairs with
     * `ctaBelow` (frees the row's right side) and reads clear of the
     * left-aligned title/subtitle column. Mutually exclusive with `badgeIcon`
     * in practice — pick one per usage.
     */
    watermarkIcon?: React.ReactNode
    /**
     * Forwards `SectionCard`'s own `accent` prop (`border-accent` ring, NOT a
     * background fill) — the canonical "highlighted/mine" card treatment
     * (`principles/accent-system` §3 "card của tôi": ring/border + 1 small
     * accent detail, never a flooded tint). A flooded `bg-accent/5..15` across
     * the whole card is the documented ACCENT-FLOOD anti-pattern (§5) — do NOT
     * reintroduce it here. Defaults to `false` (plain look, unchanged for
     * existing callers).
     */
    accented?: boolean
    /**
     * `"text"` (default) — `ctaLabel` as plain accent-coloured text; the whole
     * card is wrapped in a real `<a>`/`<button>` via {@link href}/{@link onPress}
     * so the entire surface is one tap target. `"chip"` — renders `ctaLabel` as
     * a REAL HeroUI `Button` (`variant="primary"`, which this app's theme maps
     * to `--accent`/`--accent-foreground` — see `button.css`) or `Link` (when
     * `href` is used instead of `onPress`), with a trailing `ArrowRightIcon`.
     * Native hover/focus/keyboard semantics instead of a hand-rolled `<span>` +
     * `group-hover` (thầy 2026-07-11: "render dạng Button heroui ấy"). Because
     * the Button/Link IS the real interactive element in this mode, the card
     * itself is NOT also wrapped in an outer `<a>`/`<button>` (would be a
     * nested-interactive-control a11y violation) — `href`/`onPress` apply
     * directly to the CTA control, not the whole surface.
     */
    ctaVariant?: "text" | "chip"
    /**
     * Moves `ctaLabel` out of the info row into its own full-width row below
     * the title/subtitle, instead of pinned to the far right of that row.
     * Frees the row's right side (e.g. so a `watermarkIcon` can sit there
     * without competing with the CTA) and reads better once `hideProgress`
     * removes the meter that would otherwise visually anchor the CTA's old
     * position. Defaults to `false` (original inline-right placement).
     */
    ctaBelow?: boolean
    /**
     * Omits the {@link ProgressMeter} entirely. For a resume card where the
     * bar read as one more busy element rather than useful signal (thầy
     * 2026-07-11: "nhìn phèn phèn" — cluttered look — on the flashcard resume
     * cards). `value`/`max` are simply unused when this is `true`. Defaults to
     * `false` (existing callers keep the meter).
     */
    hideProgress?: boolean
}

/**
 * ContinueCard renders a "pick up where you left off" surface inside a
 * {@link SectionCard} frame. It stacks:
 *
 * 1. An info row — `cover` (shrink-0) + a min-w-0 column with `title` (medium
 *    weight, truncated) and `subtitle` (body-xs muted, truncated) + `ctaLabel`
 *    pinned to the far right (body-sm, accent colour, shrink-0).
 * 2. A {@link ProgressMeter} spanning the full card width.
 *
 * Because HeroUI v3 {@link Card} / {@link SectionCard} is not pressable,
 * interactivity is delivered by wrapping the `<SectionCard>` in a real
 * `<a>` (for `href`) or `<button>` (for `onPress`).
 *
 * @param props - {@link ContinueCardProps}
 */
export const ContinueCard = ({
    cover,
    title,
    subtitle,
    value,
    max = 100,
    ctaLabel,
    onPress,
    href,
    urgent = false,
    badgeIcon,
    watermarkIcon,
    accented = false,
    ctaVariant = "text",
    ctaBelow = false,
    hideProgress = false,
    className,
}: ContinueCardProps) => {
    // "chip" mode makes the Button/Link below the ONE real interactive element —
    // the card itself must NOT also be wrapped in an outer `<a>`/`<button>` (that
    // would nest two interactive controls). "text" mode has no such control, so
    // the whole card stays the tap target via the wrap below.
    const chipIsInteractive = ctaVariant === "chip"
    const interactive = !chipIsInteractive && Boolean(onPress || href)

    const ctaNode = ctaLabel ? (
        ctaVariant === "chip" ? (
            href ? (
                <Link
                    href={href}
                    className="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-3xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground no-underline"
                >
                    {ctaLabel}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                </Link>
            ) : (
                <Button variant="primary" size="sm" onPress={onPress} className="w-fit shrink-0">
                    {ctaLabel}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                </Button>
            )
        ) : (
            <Typography type="body-sm" className={cn("shrink-0 text-accent", !ctaBelow && "ml-auto")}>
                {ctaLabel}
            </Typography>
        )
    ) : null

    const card = (
        <SectionCard
            accent={accented}
            className={cn("relative flex flex-col overflow-hidden", !interactive && className)}
            contentClassName="flex flex-col gap-3"
        >
            {/* Decorative watermark — bled off the bottom-right corner, sunk behind
                content, never affects layout/flow or a11y. Accent-toned (muted at low
                opacity reads as an indistinct smudge, not a shape). */}
            {watermarkIcon ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-6 text-accent opacity-40 [&_svg]:size-32"
                >
                    {watermarkIcon}
                </div>
            ) : null}

            {/* Info row: badge/cover | text column | (inline) cta label */}
            <div className="relative flex items-center gap-3">
                {/* Momentum badge — small circular tinted icon, same slot family as
                    `cover` (shrink-0). Semantic (e.g. streak), never purely decorative. */}
                {badgeIcon ? (
                    <div aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent [&_svg]:size-5">
                        {badgeIcon}
                    </div>
                ) : null}
                {/* Cover thumbnail — shrink-0 so it never compresses */}
                {cover ? <div className="shrink-0">{cover}</div> : null}

                {/* Text column: title + subtitle — min-w-0 allows truncation */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Typography weight="medium" truncate>
                        {title}
                    </Typography>
                    {subtitle ? (
                        // `color` only supports "default"/"muted" (HeroUI Typography has no
                        // semantic-tone color prop) — `text-warning` via className is the
                        // same documented exception `ctaLabel`'s `text-accent` already uses.
                        <Typography type="body-xs" color={urgent ? undefined : "muted"} className={cn(urgent && "text-warning")} truncate>
                            {subtitle}
                        </Typography>
                    ) : null}
                </div>

                {/* CTA — inline-right placement, rendered here only when NOT `ctaBelow`
                    (otherwise it moves to its own row below the info row). */}
                {!ctaBelow ? ctaNode : null}
            </div>

            {/* CTA — `ctaBelow` placement: own row under the info row. */}
            {ctaBelow ? <div className="relative">{ctaNode}</div> : null}

            {/* Progress bar spanning the full card width — omitted entirely when
                `hideProgress` (e.g. a resume card where it read as clutter rather
                than useful signal). */}
            {hideProgress ? null : <ProgressMeter value={value} max={max} />}
        </SectionCard>
    )

    // "chip" mode: the Button/Link inside `card` IS the real interactive element
    // already (and `interactive` above is always `false` for this mode, so
    // `SectionCard` already received `className` directly) — never wrap `card`
    // in another `<a>`/`<button>` here (nested-interactive-control violation).
    if (chipIsInteractive) {
        return card
    }

    if (href) {
        return (
            <a href={href} className={cn("block", className)}>
                {card}
            </a>
        )
    }
    if (onPress) {
        return (
            <button
                type="button"
                onClick={onPress}
                className={cn("block w-full text-left", className)}
            >
                {card}
            </button>
        )
    }
    return card
}
