import { Skeleton as HeroSkeleton, cn } from "@heroui/react"

/** Default field-box shimmer (single-line control height). */
export const FieldSkeleton = () => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", "h-9")} />
)

/** Textarea field-box shimmer — taller resting height (`h-24`). */
export const TextareaSkeleton = () => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", "h-24")} />
)
