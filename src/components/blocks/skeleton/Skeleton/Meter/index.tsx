import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonMeter} — no part-specific props; width is controlled via className. */
export type SkeletonMeterProps = WithClassNames<undefined>

/**
 * Skeleton matching a HeroUI <Meter/> track.
 * Meter track: h-2, full-width bar (same box as ProgressBar).
 */
export const SkeletonMeter = ({ className }: SkeletonMeterProps) => {
    return <Skeleton className={cn("h-2 w-full rounded-full", className)} />
}
