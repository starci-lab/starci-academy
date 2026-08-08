"use client"

import React, { type ComponentType } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"
import { HighlightCard } from "@/components/blocks/cards/HighlightCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SeeMoreLink } from "@/components/blocks/navigation/SeeMoreLink"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { type CallerIdentity } from "@/components/frames/_identity"

/**
 * Shape of a {@link ContinueCard} — derived from what the surface IS, not from
 * individual style flags.
 *
 * - `"item"` — one of N resume cards in a grid/list. The card is a static frame;
 *   the CTA is a real {@link SeeMoreLink} ("Continue →") on its own row — hover
 *   and click live on that link only (same as LabeledCard "See more"). It carries
 *   NO leading icon (a compact CTA tile reads off its title + "Continue →"; a
 *   decorative badge is just clutter) and no accent ring (N accented cards means
 *   none of them stands out).
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
 *
 * Does NOT take `className` (BLOCK-4 — a block hands out no escape hatch; a
 * caller that needs a specific placement wraps this card in a frame instead,
 * the same treatment `StatusChip` already carries). `ResumeCard`
 * (`@/components/pages/DashboardPage/ContinueLearning/ResumeCard`) still
 * forwards its own `className` straight into this card — that call site needs
 * a follow-up fix; it sits outside this folder so it isn't touched here.
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
    title: string
    /**
     * Optional secondary label under the title — e.g. module name, lesson
     * number, or position in a session. Truncated to one line.
     */
    subtitle?: string
    /**
     * Current progress. The {@link ProgressMeter} renders if and only if this is
     * provided — pass it only when real progress data exists. Omit it rather
     * than passing a placeholder to satisfy the type.
     */
    value?: number
    /** Maximum value representing 100 % completion. Defaults to `100`. */
    max?: number
    /**
     * Optional call-to-action label (e.g. "Continue"). Rendered — on its OWN
     * row below the title/subtitle — as a real {@link SeeMoreLink} for
     * `variant="item"` (press + hover on the link only, same as LabeledCard
     * "See more"), and as a chip button for `variant="hero"`.
     */
    ctaLabel?: string
    /**
     * Optional semantic momentum cue (e.g. `FireIcon` for a daily streak,
     * `ClockCounterClockwiseIcon` for a session left mid-flight). Rendered ONLY
     * for `variant="hero"`, where it sinks behind the content as a watermark;
     * `variant="item"` shows no leading icon, so passing one there is a no-op.
     * Decorative for a11y — {@link title} carries the accessible name. Omit when
     * the item has no such concept; never add one for visual symmetry alone.
     */
    icon?: ComponentType
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
    /**
     * Caller identity to wear on this card's root element instead of its own — pass this
     * when a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its
     * own) is using this card AS its root element, instead of wrapping it in a raw `<div
     * data-tier=… data-component=…>`. See `_identity.ts`. Forwarded to whichever element this
     * card actually draws as its outer shape — the underlying `SectionCard`, or the `Box` that
     * wraps it when `hero`'s watermark needs a clipped positioning context — never both, so the
     * pair lands on exactly one element. Omitted → that element keeps emitting its own identity,
     * unchanged.
     */
    identity?: CallerIdentity
}

/**
 * ContinueCard renders a "pick up where you left off" surface inside a
 * {@link SectionCard} frame: an info row (title + subtitle), then a CTA
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
    icon: Icon,
    urgent = false,
    onPress,
    href,
    identity,
}: ContinueCardProps) => {
    const isHero = variant === "hero"
    // A watermark icon needs (a) a positioning context sized to the card's own
    // footprint, (b) that same footprint to CLIP it at the rounded corners, and
    // (c) its siblings pulled into the same paint layer so they render above it
    // instead of under it. `SectionCard` exposes none of that (missingVocabulary:
    // no overlay/decoration slot, no relative/overflow control on the leaf) —
    // only `hero` with a real `icon` needs any of it, `item` never renders one.
    const hasWatermark = isHero && Boolean(Icon)

    // Item CTA is a real SeeMoreLink (own hover + click). Never wrap the card —
    // that would nest interactive controls and steal hover from the link.
    // Hero CTA is also its own control, so the card stays a static frame too.
    const ctaNode = ctaLabel
        ? isHero
            ? href
                ? (
                    // missingVocabulary: no atom/leaf renders a filled, pill-shaped
                    // NAVIGATIONAL link — the `Button` atom only takes `onPress`
                    // (no `href`), and `SeeMoreLink`/`Link.LinkSeeMore` render plain
                    // accent text, not a filled chip. Minimal local anchor kept for
                    // this one named-but-unsupported shape.
                    <a
                        href={href}
                        className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-3xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground no-underline"
                    >
                        {ctaLabel}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                    </a>
                )
                : (
                    <Button
                        variant="primary"
                        size="sm"
                        label={ctaLabel}
                        suffixIcon={ArrowRightIcon}
                        onPress={onPress}
                    />
                )
            : (
                <SeeMoreLink href={href} onPress={onPress}>
                    {ctaLabel}
                </SeeMoreLink>
            )
        : null

    const titleStack = (
        <StackV
            gap={3}
            classNames={["min-w-0"]}
            items={[
                () => <Typography weight="medium" truncate text={title} />,
                ...(subtitle
                    ? [
                        () => (
                            // missingVocabulary: `Typography`'s `color` union has
                            // `accent-soft`/`success-soft` but no `warning-soft` —
                            // `urgent` previously read `text-warning-soft-foreground`
                            // via `className`. Nearest atom-supported token used
                            // instead of reopening the hatch.
                            <Typography size="xs" color={urgent ? "warning" : "muted"} truncate text={subtitle} />
                        ),
                    ]
                    : []),
            ]}
        />
    )

    // Identity lands on exactly ONE element — whichever this card actually draws as its
    // outer shape. `hasWatermark` → the `Box` below is that element (it needs the clip/
    // positioning context anyway), so `SectionCard` keeps ITS OWN identity nested inside
    // instead of doubling the caller's pair onto two elements. Otherwise `SectionCard` IS
    // that element, so it takes the caller's identity directly.
    const sectionCard = (
        <SectionCard identity={hasWatermark ? undefined : identity}>
            {hasWatermark ? (
                <Box
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-6 text-accent-soft-foreground opacity-40 [&_svg]:size-32"
                >
                    {Icon ? <Icon /> : null}
                </Box>
            ) : null}
            {hasWatermark ? <Box className="relative">{titleStack}</Box> : titleStack}
            {ctaNode ? (hasWatermark ? <Box className="relative">{ctaNode}</Box> : ctaNode) : null}
            {value === undefined ? null : <ProgressMeter value={value} max={max} />}
        </SectionCard>
    )

    // The clip/positioning context the watermark needs (see `hasWatermark` above) —
    // scoped to just the card's own box so `HighlightCard`'s sweep (which
    // deliberately bleeds 2px past this same box) stays unclipped.
    const cardNode = hasWatermark
        ? <Box identity={identity} className="relative overflow-hidden rounded-3xl">{sectionCard}</Box>
        : sectionCard

    // `hero` = the ONE "resume the in-progress session" standout on its surface — the
    // canonical `HighlightCard` case (`card.md` §3j). `item` stays a static frame
    // (N of them together — a highlighted card would just fight the others for
    // attention, same reasoning `withVerdict` never applied to `item` either).
    return isHero ? <HighlightCard>{cardNode}</HighlightCard> : cardNode
}
