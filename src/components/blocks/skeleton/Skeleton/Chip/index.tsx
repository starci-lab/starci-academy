import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonChip} — no part-specific props; width is controlled via className. */
export type SkeletonChipProps = WithClassNames<undefined>

/**
 * Skeleton matching a HeroUI <Chip/> box.
 * Chip: py-0.5 (4px) + text-xs leading-5 (20px) = 24px tall → h-6, pill shape.
 */
export const SkeletonChip = ({ className }: SkeletonChipProps) => {
    return <Skeleton className={cn("h-6 w-16 rounded-full", className)} />
}

/** Folder-matching alias (export-matches-folder) — keep `SkeletonChip` as the public name. */
export { SkeletonChip as Chip }
