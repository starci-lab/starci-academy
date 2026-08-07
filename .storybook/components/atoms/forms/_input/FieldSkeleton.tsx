import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { FieldSkeletonProps } from "./types"

/** Field-box shimmer owned by input atoms. */
export const FieldSkeleton = ({ heightCls = "h-9" }: FieldSkeletonProps) => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", heightCls)} />
)
