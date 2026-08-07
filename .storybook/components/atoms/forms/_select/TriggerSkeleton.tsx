import { Skeleton as HeroSkeleton, cn } from "@heroui/react"

/** Trigger-box shimmer owned by the select atoms. */
export const TriggerSkeleton = () => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl")} />
)
