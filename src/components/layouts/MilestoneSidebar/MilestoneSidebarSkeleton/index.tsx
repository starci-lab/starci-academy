import React from "react"
import {
    cn,
    Separator,
    Skeleton,
} from "@heroui/react"

/**
 * Props for {@link MilestoneSidebarSkeleton}.
 */
export interface MilestoneSidebarSkeletonProps {
    /** Optional class applied to the sticky container. */
    className?: string
}

/**
 * Loading placeholder shown while milestones are first fetched.
 *
 * Presentational: renders three shimmer task rows, no logic.
 * @param props - optional container class name
 */
export const MilestoneSidebarSkeleton = ({
    className,
}: MilestoneSidebarSkeletonProps) => {
    return (
        <div className={cn(
            "lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto",
            className,
        )}>
            <div className="p-3 pb-[6px]">
                <Skeleton className="h-4 w-2/3 rounded-2xl my-2" />
            </div>
            <div className="p-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-5 min-w-5 min-h-5 rounded-full" />
                            <div className="flex flex-col w-full">
                                <Skeleton className="h-[14px] w-2/3 rounded-sm my-[3px] mb-2" />
                                <div className="flex flex-col">
                                    <Skeleton className="h-3 w-full rounded-sm my-0.5" />
                                    <Skeleton className="h-3 w-2/3 rounded-sm my-0.5" />
                                    <Skeleton className="h-3 w-1/2 rounded-sm my-0.5" />
                                </div>
                            </div>
                        </div>
                        <Separator className="my-3 last:hidden" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
