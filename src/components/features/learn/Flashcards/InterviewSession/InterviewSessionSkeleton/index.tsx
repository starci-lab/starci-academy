import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for the quick-quiz active layout. Mirrors the real shape:
 * a progress meter, the level/tag chips, the tall flip card (question + recall
 * input), and the reveal control.
 */
export const InterviewSessionSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <div className="flex flex-col gap-6">
                {/* session progress meter */}
                <Skeleton.Meter />
                {/* level + tag chips */}
                <div className="flex gap-2">
                    <Skeleton.Chip />
                    <Skeleton.Chip />
                </div>
                {/* the flip card (question + recall input) — fixed-height surface */}
                <div className="flex h-80 flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface sm:h-[22rem]">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <Skeleton.Typography type="body" width="3/4" />
                    <Skeleton.Typography type="body" width="2/3" />
                </div>
                {/* reveal control */}
                <div className="flex items-center justify-end gap-3">
                    <Skeleton.Button />
                </div>
            </div>
        </div>
    )
}
