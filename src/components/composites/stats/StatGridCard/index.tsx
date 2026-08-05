import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/composites/stats/StatGridCard`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One cell of a {@link StatGridCard} — free-form content (icon + label + value + meter, or anything else). */
export interface StatGridCardItem {
    /** Stable key. */
    key: string
    /**
     * Cell content — the block owns grid/border structure only, content is free-form. A
     * COMPONENT reference (COMPOSITE-8), never a built node: the card calls it itself and
     * forwards {@link StatGridCardProps.isSkeleton}, so cells can shimmer in place.
     */
    content: ComponentTypeWithSkeleton
}

/** Props for the {@link StatGridCard} block. */
export interface StatGridCardProps {
    /** Cells, in display order. */
    items: Array<StatGridCardItem>
    /** `true` → render every cell's `content` in its skeleton state. Default `false`. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * A bounded SURFACE card whose cells sit in a 2-col grid, divided by thin
 * `border-default` seams — the grid sibling of `SurfaceCardList` (a vertical LIST
 * of full-width rows): use this instead when the content reads better as compact
 * stat cells side-by-side. Seams (not `gap`) keep the card reading as ONE
 * continuous bordered block.
 *
 * An ODD item count never leaves a dangling empty cell — the last item spans both
 * columns automatically.
 *
 * @param props - {@link StatGridCardProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "StatGridCard" } as const

/** A bordered card whose stat cells sit in a seam-divided 2-column grid. */
export const StatGridCard = ({ items, isSkeleton = false, classNames}: StatGridCardProps) => {
    const total = items.length
    const isOddTotal = total % 2 === 1

    return (
        <div
            className={cn("grid grid-cols-2 overflow-hidden rounded-3xl border border-default bg-surface", classNames)}
            data-tier="composite"
            data-component="StatGridCard"
        >
            {items.map((item, index) => {
                const isLastOddSpan = isOddTotal && index === total - 1
                const isRightCol = index % 2 === 1
                const isLastRow = isLastOddSpan || index >= total - (isOddTotal ? 1 : 2)
                const Content = item.content
                return (
                    <div
                        key={item.key}
                        data-principle="cell-pad"
                        className={cn(
                            "flex flex-col gap-3 p-3",
                            isLastOddSpan && "col-span-2",
                            !isLastOddSpan && !isRightCol && "border-r border-default",
                            !isLastRow && "border-b border-default")}
                    >
                        <Content isSkeleton={isSkeleton} />
                    </div>
                )
            })}
        </div>
    )
}
