import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One cell of a {@link StatGridCard} — free-form content (icon + label + value + meter, or anything else). */
export interface StatGridCardItem {
    /** Stable key. */
    key: string
    /** Cell content — the block owns grid/border structure only, content is free-form. */
    content: ReactNode
}

/** Props for the {@link StatGridCard} block. */
export interface StatGridCardProps extends WithClassNames<undefined> {
    /** Cells, in display order. */
    items: Array<StatGridCardItem>
}

/**
 * A bounded SURFACE card whose cells sit in a 2-col grid, divided by thin
 * `border-default` seams — the grid sibling of {@link SurfaceListCard} (a
 * vertical LIST of full-width rows): use this instead when the content reads
 * better as compact stat cells side-by-side (weekly-goal KPIs) rather than a
 * tall single-column list. Seams (not `gap`) keep the card reading as ONE
 * continuous bordered block — the same technique documented for
 * `CourseProgressBar`'s equal lanes (`.claude/fe/components/meter.md`):
 * splitting a bordered surface via `gap` lets the page background show
 * through and breaks the card into floating pieces.
 *
 * An ODD item count never leaves a dangling empty cell — the last item spans
 * both columns automatically.
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
