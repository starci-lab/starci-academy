import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps } from "../surface-card-header"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `SurfaceCard` of the `Surface*Card`
 * family. Authored in Storybook (not `src`); synced to `src` later.
 */

/** Props for the target {@link SurfaceCard}. */
export interface SurfaceCardProps extends SurfaceLabelProps {
    /** Card body content. */
    children: ReactNode
    /** Secondary node rendered OUTSIDE (below) the card, `gap-2` — a caption/prompt. */
    description?: ReactNode
    /** `border border-default` on top of `shadow-surface` — for a distinct bounded surface. */
    bordered?: boolean
    /** Drop padding on the card + content so an edge-owning child sits flush. */
    flushContent?: boolean
    /** Extra classes on the section wrapper. */
    className?: string
    /** Extra classes on the `CardContent` wrapper. */
    contentClassName?: string
}

/**
 * The generic `bg-surface` content card of the `Surface*Card` family, with an
 * OPTIONAL section header baked in — pass `label` and it renders a `Label` OUTSIDE
 * (above) the card, plus one optional right slot (`action` ▸ `onSeeMore` ▸ `labelEnd`).
 * Omit `label` and the card renders bare.
 *
 * @param props - {@link SurfaceCardProps}
 */
export const SurfaceCard = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
    children,
    description,
    bordered = false,
    flushContent = false,
    className,
    contentClassName,
}: SurfaceCardProps) => {
    const card = (
        <div
            className={cn(
                surfaceFrame(bordered),
                flushContent ? "overflow-hidden" : "p-3",
                contentClassName,
            )}
        >
            {children}
        </div>
    )
    const body = description != null ? (
        <div className="flex flex-col gap-2">
            {card}
            {description}
        </div>
    ) : card
    return (
        <section className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <SurfaceCardHeader
                label={label}
                labelEnd={labelEnd}
                onSeeMore={onSeeMore}
                seeMoreLabel={seeMoreLabel}
                action={action}
                subtleLabel={subtleLabel}
            />
            {body}
        </section>
    )
}
