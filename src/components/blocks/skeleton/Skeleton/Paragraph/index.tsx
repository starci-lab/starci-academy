import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonParagraph}. */
export interface SkeletonParagraphProps extends WithClassNames<undefined> {
    /** Number of text lines to render. */
    lines?: number
}

/**
 * Skeleton matching a HeroUI prose paragraph (text-base leading-7, 16/28). Each
 * bar is the glyph height (h-4 = 16px) centered `my-[6px]` (6+6=12) so the line
 * box is exactly 28px (leading-7) — lines sit TIGHT like real prose, not loose.
 * The last line is shortened (w-2/3) to mimic a paragraph end.
 */
export const SkeletonParagraph = ({ lines = 3, className }: SkeletonParagraphProps) => {
    const count = Math.max(1, lines)
    return (
        <div className={cn("flex flex-col", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    className={cn(
                        "h-4 my-[6px] rounded",
                        index === count - 1 ? "w-2/3" : "w-full",
                    )}
                />
            ))}
        </div>
    )
}
