import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonTextArea}. */
export interface SkeletonTextAreaProps extends WithClassNames<undefined> {
    /**
     * Number of text rows the textarea renders. Defaults to 3. Drives the block
     * height (~1.25rem per row + the px-3 py-2 field padding).
     */
    rows?: number
}

/**
 * Skeleton matching a HeroUI <TextArea/> field box (multi-row). A real EMPTY
 * textarea is just an empty rounded field box, so this is ONE shimmer block sized
 * to the field footprint (rounded-field = rounded-xl), height derived from `rows`
 * — not stacked text bars (that would read as pre-filled content).
 */
export const SkeletonTextArea = ({ rows = 3, className }: SkeletonTextAreaProps) => (
    <div
        className={cn("w-full", className)}
        style={{ height: `${rows * 20 + 16}px` }}
    >
        <Skeleton className="h-full w-full rounded-xl" />
    </div>
)
