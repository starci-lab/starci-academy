import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonBadge} — no part-specific props; the small badge is a fixed square dot. */
export type SkeletonBadgeProps = WithClassNames<undefined>

/**
 * Skeleton matching a HeroUI <Badge/> box (small size).
 * Badge --sm: min-h-4 min-w-4 → 16px square, circular shape.
 */
export const SkeletonBadge = ({ className }: SkeletonBadgeProps) => {
    return <Skeleton className={cn("size-4 rounded-full", className)} />
}

/** Folder-matching alias (export-matches-folder) — keep `SkeletonBadge` as the public name. */
export { SkeletonBadge as Badge }
