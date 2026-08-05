import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { FieldSkeletonProps } from "./types"

/** Field-box shimmer owned by the input atoms — also used by `InputTags`. */
export const FieldSkeleton = ({ heightCls = "h-9", classNames }: FieldSkeletonProps) => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", heightCls, classNames)} />
)

export const meta = { tier: "atom", name: "FieldSkeleton" } as const
