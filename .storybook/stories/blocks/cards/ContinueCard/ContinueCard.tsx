import React from "react"
import { Button, Link, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { HighlightCard } from "../HighlightCard/HighlightCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { SeeMoreLink } from "../../navigation/SeeMoreLink/SeeMoreLink"
import { ProgressMeter } from "../../stats/ProgressMeter/ProgressMeter"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/cards/ContinueCard`. Composed from the local primitives
 * `SectionCard` (frame) + `HighlightCard` (sweep wrapper for `hero`) +
 * `SeeMoreLink` (item CTA) + `ProgressMeter` (progress). Synced to `src` later.
 */

/**
 * Shape of a {@link ContinueCard} — derived from what the surface IS, not from
 * individual style flags.
 *
 * - `"item"` — one of N resume cards in a grid/list. The card is a static frame;
 *   the CTA is a real {@link SeeMoreLink} ("Tiếp tục →") on its own row — hover
 *   and click live on that link only. It carries NO leading icon and no accent
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
 * {@link ContinueCardProps.onPress} or {@link ContinueCardProps.href}; the block
 * fetches nothing and reads no global store.
 */
export interface ContinueCardProps {
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
     * provided — pass it only when real progress data exists.
     */
    value?: number
    /** Maximum value representing 100 % completion. Defaults to `100`. */
    max?: number
    /**
     * Optional call-to-action label (e.g. "Tiếp tục"). Rendered — on its OWN
     * row below the title/subtitle — as a real {@link SeeMoreLink} for
     * `variant="item"`, and as a chip button for `variant="hero"`.
     */
    ctaLabel?: React.ReactNode
    /**
     * Optional semantic momentum cue (e.g. a streak / clock icon). Rendered ONLY
     * for `variant="hero"`, where it sinks behind the content as a watermark;
     * `variant="item"` shows no leading icon, so passing one there is a no-op.
     * Decorative for a11y — {@link ContinueCardProps.title} carries the name.
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
     * Prefer {@link ContinueCardProps.href} for pure navigation.
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link ContinueCardProps.onPress}. */
    href?: string
    /** Extra classes on the card root. */
    className?: string
}

/**
 * ContinueCard renders a "pick up where you left off" surface inside a
 * {@link SectionCard} frame: an info row (title + subtitle), then a CTA row
 * (both variants render `ctaLabel` here, never inline with the title), then a
 * {@link ProgressMeter} when {@link ContinueCardProps.value} is provided. The
 * `hero` variant is wrapped in {@link HighlightCard} for the sweeping-light ring.
 *
 * @param props - {@link ContinueCardProps}
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

    const cardNode = (
        <SectionCard
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

    // `hero` = the ONE "tiếp tục phiên đang dở" standout on its surface — the
    // canonical `HighlightCard` case (`card.md` §3j). `item` stays a static frame
    // (N of them together — a highlighted card would just fight the others).
    return isHero ? <HighlightCard>{cardNode}</HighlightCard> : cardNode
}
