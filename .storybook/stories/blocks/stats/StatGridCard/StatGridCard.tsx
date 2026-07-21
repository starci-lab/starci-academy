import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/StatGridCard`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One cell of a {@link StatGridCard} — free-form content (icon + label + value + meter, or anything else). */
export interface StatGridCardItem {
    /** Stable key. */
    key: string
    /** Cell content — the block owns grid/border structure only, content is free-form. */
    content: ReactNode
}

/** Props for the {@link StatGridCard} block. */
export interface StatGridCardProps {
    /** Cells, in display order. */
    items: Array<StatGridCardItem>
    /** Extra classes on the root element. */
    className?: string
}

/**
 * A bounded SURFACE card whose cells sit in a 2-col grid, divided by thin
 * `border-default` seams — the grid sibling of `SurfaceListCard` (a vertical LIST
 * of full-width rows): use this instead when the content reads better as compact
 * stat cells side-by-side. Seams (not `gap`) keep the card reading as ONE
 * continuous bordered block.
 *
 * An ODD item count never leaves a dangling empty cell — the last item spans both
 * columns automatically.
 *
 * @param props - {@link StatGridCardProps}
 */
export const StatGridCard = ({ items, className }: StatGridCardProps) => {
    const total = items.length
    const isOddTotal = total % 2 === 1

    return (
        <div className={cn("grid grid-cols-2 overflow-hidden rounded-3xl border border-default bg-surface", className)}>
            {items.map((item, index) => {
                const isLastOddSpan = isOddTotal && index === total - 1
                const isRightCol = index % 2 === 1
                const isLastRow = isLastOddSpan || index >= total - (isOddTotal ? 1 : 2)
                return (
                    <div
                        key={item.key}
                        className={cn(
                            "flex flex-col gap-3 p-3",
                            isLastOddSpan && "col-span-2",
                            !isLastOddSpan && !isRightCol && "border-r border-default",
                            !isLastRow && "border-b border-default",
                        )}
                    >
                        {item.content}
                    </div>
                )
            })}
        </div>
    )
}
