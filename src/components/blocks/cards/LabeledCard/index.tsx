import React, { type ComponentType } from "react"
import type { ReactNode } from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { SeeMoreLink } from "@/components/blocks/navigation/SeeMoreLink"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/** Props for the {@link LabeledCard} block. */
export interface LabeledCardProps {
    /** Section title rendered OUTSIDE (above) the card. */
    label: string
    /**
     * Optional secondary label pinned to the RIGHT of the label row (muted) — a
     * passive tag, NOT an action (e.g. a currency "VND", a count, a unit). Rendered
     * only when neither `action` nor `onSeeMore` claim the right slot.
     */
    labelEnd?: string
    /**
     * When provided, renders a shared {@link SeeMoreLink} on the right of the
     * label (semibold accent text + a caret that slides right on hover).
     */
    onSeeMore?: () => void
    /** Text for the see-more link. Defaults to "See more" — pass `t(...)` to localise. */
    seeMoreLabel?: string
    /**
     * Arbitrary right-aligned slot in the label row (e.g. an owner "Add / manage"
     * button) — a buildable slot. Takes precedence over `onSeeMore` when both are passed.
     */
    action?: ComponentType
    /** Card body content. */
    children: ReactNode
    /**
     * Optional secondary slot rendered OUTSIDE (below) the card, `gap-2` from
     * it — a caption/prompt/status that belongs to the section but not inside the
     * surface (e.g. a "complete all 3 to claim" prompt, a claim button) — a
     * buildable slot. Kept below the card so it never becomes surface-in-surface.
     * Caller owns its alignment.
     */
    description?: ComponentType
    /**
     * When true, drop the inner `<Card>` frame and render children directly under
     * the label — for sections whose content is ITSELF card(s) (e.g. a grid of
     * resume / course cards), so they never nest card-in-card.
     */
    frameless?: boolean
    /**
     * When true, the framed card drops padding on BOTH the root `.card` (HeroUI
     * bakes `p-4` there) and `CardContent`, so an EDGE-OWNING child (Accordion /
     * Table / full-bleed divider list) sits flush to the card edges — avoids the
     * inset-divider look. Ignored when `frameless`.
     */
    flushContent?: boolean
    /**
     * When true, the section + framed card stretch to fill their container's height
     * (`h-full` + the card grows via `flex-1`). Use for side-by-side cards in a grid
     * row so uneven content (e.g. a 1-line vs 2-line empty state) still renders at
     * equal height. Ignored when `frameless`.
     */
    fillHeight?: boolean
    /**
     * Renders the label as a SUBTLE eyebrow (`text-xs text-muted`) with a tighter
     * `gap-2` to the content, instead of the default section `Label` + `gap-3`. For
     * a minor/secondary header over a block — e.g. a time-bucket "Today" over a run
     * list — where a full section label reads too heavy (teacher 2026-07-13: "if a card
     * needs a secondary label, use label-gap-2"). `labelEnd` shrinks to `text-xs` to match.
     */
    subtleLabel?: boolean
    /**
     * When true, adds `border border-default` on top of the default
     * `shadow-surface` — for shells that need to stand out as a distinct
     * bounded surface even against a `bg-surface` sibling (e.g. FlipCard's
     * question/answer pair). Default false preserves the elevation-only
     * convention for every other LabeledCard consumer.
     */
    bordered?: boolean
    /**
     * Caller identity to wear on this block's root `<section>` instead of its own — pass this
     * when a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its
     * own) is using this card AS its root element, instead of wrapping it in a raw `<div
     * data-tier=… data-component=…>`. See `_identity.ts`. Omitted → this section keeps emitting
     * no `data-tier`/`data-component` at all, unchanged (this block has no identity of its own).
     */
    identity?: CallerIdentity
}

/**
 * The StarCi section card (UI 2.0): the title is a `Label` that sits OUTSIDE,
 * above the card, while the `Card` holds only content — `<Label/>` then
 * `<Card>…</Card>`. Optionally shows a right-aligned "see more →" link (the caret
 * slides right on hover). Replaces the legacy in-card header (SectionCard); owns
 * the whole look so features just pass label / see-more / children.
 *
 * @param props - {@link LabeledCardProps}
 * @see Story: .storybook/stories/blocks/cards/LabeledCard/LabeledCard.stories
 */
export const LabeledCard = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel = "See more",
    action: Action,
    children,
    description: Description,
    frameless = false,
    flushContent = false,
    fillHeight = false,
    subtleLabel = false,
    bordered = false,
    identity,
}: LabeledCardProps) => {
    // Right slot of the label row — action wins over onSeeMore, which wins over labelEnd.
    const endSlot = Action ? <Action /> : (onSeeMore ? (
        <SeeMoreLink onPress={onSeeMore} size={subtleLabel ? "xs" : "sm"}>
            {seeMoreLabel}
        </SeeMoreLink>
    ) : labelEnd != null ? (
        <Typography size={subtleLabel ? "xs" : "sm"} color="muted" classNames={["shrink-0"]} text={labelEnd} />
    ) : null)
    // Non-subtle label goes through the atom instead of HeroUI `Label`: `Label` renders
    // exactly 14px/500/lh-20 = `size="sm" weight="medium"` (documented equivalence, see
    // `composites/cards/SurfaceCard/surface-card-header.tsx`), so the shape is unchanged.
    const labelSlot = subtleLabel ? (
        <Typography size="xs" color="muted" truncate classNames={["min-w-0"]} text={label} />
    ) : (
        <Typography size="sm" weight="medium" classNames={["min-w-0"]} text={label} />
    )
    // card body: frameless = content is itself card(s) → no inner Card (avoid nesting)
    const body = frameless ? (
        children
    ) : (
        <Card
            className={cn(
                bordered && "border border-default",
                fillHeight && "flex-1",
                // root `.card` bakes p-4 — zero it here or flush children stay inset
                flushContent && "gap-0 overflow-hidden p-0",
            )}
        >
            <CardContent className={cn(flushContent && "p-0", fillHeight && "h-full")}>
                {children}
            </CardContent>
        </Card>
    )
    return (
        <section
            {...resolveIdentity(identity, { tier: "composite", name: "LabeledCard" })}
            data-principle={subtleLabel ? "sublabel-field" : "label-field"}
            className={cn("flex flex-col", subtleLabel ? "gap-2" : "gap-3", fillHeight && "h-full")}
        >
            <StackH gap={4} principle="content-row" justify="between" items={[() => labelSlot, () => endSlot]}
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            />
            {/* description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface */}
            {Description ? (
                <StackV gap={3} items={[() => body, () => <Description />]} />
            ) : body}
        </section>
    )
}
