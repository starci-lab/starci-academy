"use client"

import React from "react"
import { Button, Link, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { SeeMoreLink } from "@/components/blocks/navigation/SeeMoreLink"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"

/**
 * Shape of a {@link ContinueCard} — derived from what the surface IS, not from
 * individual style flags.
 *
 * - `"item"` — one of N resume cards in a grid/list. The card is a static frame;
 *   the CTA is a real {@link SeeMoreLink} ("Tiếp tục →") on its own row — hover
 *   and click live on that link only (same as LabeledCard "Xem thêm"), `icon`
 *   leads the info row as a small round badge, and the card carries no accent
 *   ring (N accented cards means none of them stands out).
 * - `"hero"` — the single standout "you left this in progress" card on a
 *   surface. The CTA is a real chip button on its own row, `icon` sinks behind
 *   the content as a watermark, and the card gets an accent ring.
 */
export type ContinueCardVariant = "item" | "hero"

/**
 * Props for the {@link ContinueCard} block.
 *
 * A presentational, props-only card that surfaces a single "continue where you
 * left off" item. All interactivity is delivered by the caller via
 * {@link onPress} or {@link href}; the block fetches nothing and reads no
 * global store.
 */
export interface ContinueCardProps extends WithClassNames<undefined> {
    /**
     * What this card IS on its surface — see {@link ContinueCardVariant}.
     * Required: it decides icon placement, CTA affordance, and accent together,
     * so a surface cannot end up with an arbitrary mix of the three.
     */
    variant: ContinueCardVariant
    /**
     * Primary label of the item being continued (course / module / lesson
     * title). Rendered via {@link Typography} weight="medium", truncated to one
     * line.
     */
    title: React.ReactNode
    /**
     * Optional secondary label under the title — e.g. module name, lesson
     * number, or position in a session. Truncated to one line.
     */
    subtitle?: React.ReactNode
    /**
     * Current progress. The {@link ProgressMeter} renders if and only if this is
     * provided — pass it only when real progress data exists. Omit it rather
     * than passing a placeholder to satisfy the type.
     */
    value?: number
    /** Maximum value representing 100 % completion. Defaults to `100`. */
    max?: number
    /**
     * Optional call-to-action label (e.g. "Tiếp tục"). Rendered — on its OWN
     * row below the title/subtitle — as a real {@link SeeMoreLink} for
     * `variant="item"` (press + hover on the link only, same as LabeledCard
     * "Xem thêm"), and as a chip button for `variant="hero"`.
     */
    ctaLabel?: React.ReactNode
    /**
     * Optional semantic momentum cue (e.g. `FireIcon` for a daily streak,
     * `ClockCounterClockwiseIcon` for a session left mid-flight). Placement
     * follows {@link variant}. Decorative for a11y — {@link title} carries the
     * accessible name. Omit when the item has no such concept; never add one for
     * visual symmetry alone.
     */
    icon?: React.ReactNode
    /**
     * Renders `subtitle` in warning tone instead of muted — only for a REAL
     * time-sensitive fact already present in the subtitle text (e.g. a
     * server-enforced deadline). Never fabricate a countdown to trigger this.
     */
    urgent?: boolean
    /**
     * Optional press handler. For `variant="item"` it wires to the
     * {@link SeeMoreLink} CTA; for `variant="hero"` it wires to the CTA chip.
     * Prefer {@link href} for pure navigation.
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link onPress}. */
    href?: string
}

/**
 * ContinueCard renders a "pick up where you left off" surface inside a
 * {@link SectionCard} frame: an info row (icon + title + subtitle), then a CTA
 * row (both variants render `ctaLabel` here, never inline with the title —
 * see {@link ContinueCardProps.ctaLabel}), then a {@link ProgressMeter} when
 * {@link ContinueCardProps.value} is provided.
 *
 * @param props - {@link ContinueCardProps}
 * @see Story: .storybook/stories/blocks/cards/ContinueCard/ContinueCard.stories
 */
export const ContinueCard = ({
    variant,
    title,
    subtitle,
    value,
    max = 100,
    ctaLabel,
    icon,
    urgent = false,
    onPress,
    href,
    className,
}: ContinueCardProps) => {
    const isHero = variant === "hero"
    // Item CTA is a real SeeMoreLink (own hover + click). Never wrap the card —
    // that would nest interactive controls and steal hover from the link.
    // Hero CTA is also its own control, so the card stays a static frame too.

    const ctaNode = ctaLabel
        ? isHero
            ? href
                ? (
                    <Link
                        href={href}
                        className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-3xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground no-underline"
                    >
                        {ctaLabel}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                    </Link>
                )
                : (
                    <Button variant="primary" size="sm" onPress={onPress} className="w-fit shrink-0">
                        {ctaLabel}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                    </Button>
                )
            : (
                <SeeMoreLink href={href} onPress={onPress}>
                    {ctaLabel}
                </SeeMoreLink>
            )
        : null

    return (
        <SectionCard
            accent={isHero}
            className={cn("relative flex flex-col overflow-hidden", className)}
            contentClassName="flex flex-col gap-3"
        >
            {isHero && icon ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-6 text-accent-soft-foreground opacity-40 [&_svg]:size-32"
                >
                    {icon}
                </div>
            ) : null}

            <div className="relative flex items-center gap-3">
                {!isHero && icon ? (
                    <div
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground [&_svg]:size-5"
                    >
                        {icon}
                    </div>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Typography weight="medium" truncate>
                        {title}
                    </Typography>
                    {subtitle ? (
                        // Typography's `color` prop has no semantic tones — the warning
                        // tint has to come through className.
                        <Typography
                            type="body-xs"
                            color={urgent ? undefined : "muted"}
                            className={cn(urgent && "text-warning-soft-foreground")}
                            truncate
                        >
                            {subtitle}
                        </Typography>
                    ) : null}
                </div>
            </div>

            {ctaNode ? <div className="relative">{ctaNode}</div> : null}

            {value === undefined ? null : <ProgressMeter value={value} max={max} />}
        </SectionCard>
    )
}
