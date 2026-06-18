import React from "react"
import type { ReactNode } from "react"
import { Card, CardContent, Label, Link, cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link LabeledCard} block. */
export interface LabeledCardProps extends WithClassNames<undefined> {
    /** Section title rendered OUTSIDE (above) the card. */
    label: ReactNode
    /** Optional leading icon shown before the label. */
    icon?: ReactNode
    /**
     * When provided, renders a "see more" link on the right of the label
     * (label text + a caret that slides right on hover).
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
    /** Extra classes merged onto the card content wrapper. */
    contentClassName?: string
}

/**
 * The StarCi section card (UI 2.0): the title is a `Label` that sits OUTSIDE,
 * above the card, while the `Card` holds only content — `<Label/>` then
 * `<Card>…</Card>`. Optionally shows a right-aligned "see more →" link (the caret
 * slides right on hover). Replaces the legacy in-card header (SectionCard); owns
 * the whole look so features just pass label / icon / see-more / children.
 *
 * @param props - {@link LabeledCardProps}
 */
export const LabeledCard = ({
    label,
    icon,
    onSeeMore,
    seeMoreLabel = "Xem thêm",
    action,
    children,
    className,
    contentClassName,
}: LabeledCardProps) => {
    return (
        <section className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    {icon}
                    <Label>{label}</Label>
                </div>
                {action ?? (onSeeMore ? (
                    <Link
                        onPress={onSeeMore}
                        className="group inline-flex shrink-0 cursor-pointer items-center gap-1 text-accent"
                    >
                        {seeMoreLabel}
                        <CaretRightIcon
                            aria-hidden
                            focusable="false"
                            className="size-4 transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                ) : null)}
            </div>
            <Card>
                <CardContent className={cn(contentClassName)}>
                    {children}
                </CardContent>
            </Card>
        </section>
    )
}
