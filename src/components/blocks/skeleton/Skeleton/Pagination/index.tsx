import React from "react"
import { Skeleton, cn } from "@heroui/react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonPagination}. */
export interface SkeletonPaginationProps extends WithClassNames<undefined> {
    /** Number of page-number squares between the prev/next arrows. Defaults to 3. */
    count?: number
}

/** Prev/next arrow slot — a chevron centered in the SAME 32px box as a page button. */
const ARROW_SLOT = "flex size-9 shrink-0 items-center justify-center md:size-8"

/**
 * Skeleton matching a HeroUI <Pagination/> content row: real prev/next chevrons
 * (structural affordances) bracketing `count` page-number squares as skeleton —
 * i.e. `‹ [ske] [ske] [ske] ›`. Arrows sit in the SAME size-9/md:size-8 box as the
 * squares so all slots line up uniformly; gap-1 between.
 */
export const SkeletonPagination = ({
    className,
    count = 3,
}: SkeletonPaginationProps) => {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className={ARROW_SLOT}>
                <CaretLeftIcon className="size-4 text-muted" aria-hidden focusable="false" />
            </div>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="size-9 rounded-3xl md:size-8"
                />
            ))}
            <div className={ARROW_SLOT}>
                <CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />
            </div>
        </div>
    )
}
