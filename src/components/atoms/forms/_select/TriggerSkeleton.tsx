import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { TriggerSkeletonProps } from "./types"

/** Trigger-box shimmer owned by the select atoms. */
export const TriggerSkeleton = ({ classNames }: TriggerSkeletonProps) => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl", classNames)} />
)
