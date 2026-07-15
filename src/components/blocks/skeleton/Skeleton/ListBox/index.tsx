import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonListBox}. */
export interface SkeletonListBoxProps extends WithClassNames<undefined> {
    /** Number of option rows to render. Defaults to 4. */
    items?: number
}

/** Text-width per option so bars read as LABELS, not full-width solid blocks. */
const OPTION_WIDTHS = ["w-3/5", "w-2/5", "w-4/5", "w-1/2", "w-2/3"]

/**
 * Skeleton matching a HeroUI <ListBox/>: `p-1` container, each option a
 * `rounded-xl px-3 py-2` row (matches an option's padding) with a `body-sm`
 * glyph bar sized to the LABEL width (varying, not `w-full`) so it reads as a
 * text option rather than a solid block.
 */
export const SkeletonListBox = ({ items = 4, className }: SkeletonListBoxProps) => {
    return (
        <div className={cn("flex w-full flex-col gap-1 p-1", className)}>
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className="rounded-xl px-3 py-2">
                    <Skeleton
                        className={cn("h-[14px] rounded", OPTION_WIDTHS[index % OPTION_WIDTHS.length])}
                    />
                </div>
            ))}
        </div>
    )
}
