import React from "react"
import {
    Skeleton,
} from "@heroui/react"

/**
 * Loading placeholder for the StarCI AI screen — a title bar plus three card
 * skeletons mirroring the model-card layout.
 *
 * Presentational (render-only).
 */
export const StarciAiSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-10 w-64 rounded-2xl" />
            <div className="flex flex-col gap-4">
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
