import React from "react"
import {
    cn,
    Skeleton,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link StarciAiSkeleton}. */
export interface StarciAiSkeletonProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props. */
    readonly _reserved?: undefined
}

/**
 * Loading placeholder for the StarCI AI screen — a title bar plus three card
 * skeletons mirroring the model-card layout.
 *
 * Presentational (render-only).
 */
export const StarciAiSkeleton = ({ className }: StarciAiSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3 p-6", className)}>
            <Skeleton className="h-10 w-64 rounded-2xl" />
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((index) => (
                    <Skeleton
                        key={index}
                        className="h-48 w-full rounded-3xl"
                    />
                ))}
            </div>
        </div>
    )
}
