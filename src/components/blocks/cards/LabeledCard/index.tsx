import React from "react"
import type { ReactNode } from "react"
import { Card, CardContent, Label, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SeeMoreLink } from "@/components/blocks/navigation/SeeMoreLink"

/** Props for the {@link LabeledCard} block. */
export interface LabeledCardProps extends WithClassNames<undefined> {
    /** Section title rendered OUTSIDE (above) the card. */
    label: ReactNode
    /**
     * Optional secondary label pinned to the RIGHT of the label row (muted) — a
     * passive tag, NOT an action (e.g. a currency "VND", a count, a unit). Rendered
     * only when neither `action` nor `onSeeMore` claim the right slot.
     */
    labelEnd?: ReactNode
    /**
     * When provided, renders a shared {@link SeeMoreLink} on the right of the
     * label (semibold accent text + a caret that slides right on hover).
     */
    onSeeMore?: () => void
    /** Text for the see-more link. Defaults to "Xem thêm" — pass `t(...)` to localise. */
    seeMoreLabel?: ReactNode
    /**
     * Arbitrary right-aligned slot in the label row (e.g. an owner "Add / manage"
     * button). Takes precedence over `onSeeMore` when both are passed.
     */
    action?: ReactNode
    /** Card body content. */
    children: ReactNode
    /**
     * Optional secondary text/node rendered OUTSIDE (below) the card, `gap-2` from
     * it — a caption/prompt/status that belongs to the section but not inside the
     * surface (e.g. a "complete all 3 to claim" prompt, a claim button). Kept below
     * the card so it never becomes surface-in-surface. Caller owns its alignment.
     */
    description?: ReactNode
    /** Extra classes merged onto the card content wrapper. */
    contentClassName?: string
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
     * a minor/secondary header over a block — e.g. a time-bucket "Hôm nay" over a run
     * list — where a full section label reads too heavy (thầy 2026-07-13: "nếu card
     * cần label phụ thì label-gap-2"). `labelEnd` shrinks to `text-xs` to match.
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
    seeMoreLabel = "Xem thêm",
    action,
    children,
    description,
    className,
    contentClassName,
    frameless = false,
    flushContent = false,
    fillHeight = false,
    subtleLabel = false,
    bordered = false,
}: LabeledCardProps) => {
    return (
        <section className={cn("flex flex-col", subtleLabel ? "gap-2" : "gap-3", fillHeight && "h-full", className)}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    {subtleLabel ? (
                        <span className="truncate text-xs text-muted">{label}</span>
                    ) : (
                        <Label>{label}</Label>
                    )}
                </div>
                {action ?? (onSeeMore ? (
                    <SeeMoreLink onPress={onSeeMore} size={subtleLabel ? "xs" : "sm"}>
                        {seeMoreLabel}
                    </SeeMoreLink>
                ) : labelEnd != null ? (
                    <span className={cn("shrink-0 text-muted", subtleLabel ? "text-xs" : "text-sm")}>{labelEnd}</span>
                ) : null)}
            </div>
            {/* card body: frameless = content is itself card(s) → no inner Card (avoid nesting) */}
            {(() => {
                const body = frameless ? (
                    <div className={cn(contentClassName)}>{children}</div>
                ) : (
                    <Card
                        className={cn(
                            bordered && "border border-default",
                            fillHeight && "flex-1",
                            // root `.card` bakes p-4 — zero it here or flush children stay inset
                            flushContent && "gap-0 overflow-hidden p-0",
                        )}
                    >
                        <CardContent className={cn(flushContent && "p-0", fillHeight && "h-full", contentClassName)}>
                            {children}
                        </CardContent>
                    </Card>
                )
                // description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface
                return description != null ? (
                    <div className="flex flex-col gap-2">
                        {body}
                        {description}
                    </div>
                ) : body
            })()}
        </section>
    )
}
