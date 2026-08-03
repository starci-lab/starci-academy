import { cn } from "@heroui/react"
import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Skeleton for a submission attempt card — mirrors {@link import("../SubmissionAttemptCard").SubmissionAttemptCard}'s
 * bordered (not filled) shape via the {@link Skeleton} block, so loading never nests
 * a filled surface inside the drawer's own surface.
 */
export type SubmissionAttemptCardSkeletonProps = WithClassNames<undefined>
export const SubmissionAttemptCardSkeleton = (props: SubmissionAttemptCardSkeletonProps) => {
    const { className } = props
    return (
        <div className={cn("rounded-2xl border border-default p-4", className)}>
            <div className="flex items-center justify-between gap-3">
                <Skeleton.Typography type="body" width="1/3" />
                <Skeleton.Chip className="w-14" />
            </div>
            <div className="h-3" />
            <div className="flex flex-col gap-0">
                <Skeleton.Typography type="body-sm" width="full" />
                <Skeleton.Typography type="body-sm" width="3/4" />
            </div>
            <div className="h-3" />
            <div className="flex gap-2">
                <Skeleton.Button width="w-28" />
                <Skeleton.Button width="w-36" />
            </div>
        </div>
    )
}