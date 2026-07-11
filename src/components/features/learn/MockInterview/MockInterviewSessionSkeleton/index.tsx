import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Segment count mirrors the setup default question draw (see `QNA_QUESTION_COUNT`
 *  in `MockInterviewSession`) — an approximate legend length is fine since the
 *  real bar redraws immediately once the session's actual total is known. */
const PROGRESS_SEGMENTS = 5

/**
 * Loading placeholder for the LIVE interview surface — shown while
 * `courseId`/`courseDisplayId`/the enrollment check are still resolving on
 * the dedicated `/interview/[sessionId]` resume route (before
 * {@link import("../MockInterviewSession").MockInterviewSession} itself has
 * mounted, so its own resume-rehydrate effect hasn't started yet). Mirrors
 * `WorkSessionHeader` (back-link · identity · counter · timer · progress
 * segments) + the interviewer presence card (avatar + name/role + a 4-line
 * question) + the voice hero's push-to-talk mic + the answer action row.
 */
export const MockInterviewSessionSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={cn("flex w-full flex-col", className)}>
            {/* sub-navbar band — mirrors WorkSessionHeader */}
            <div className="sticky top-16 z-10 border-b border-default bg-surface">
                <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
                    {/* back-link ("Rời") */}
                    <Skeleton className="h-4 w-14 rounded" />
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    {/* identity — persona avatar + name */}
                    <span className="flex min-w-0 items-center gap-2">
                        <Skeleton className="size-7 shrink-0 rounded-full" />
                        <Skeleton className="hidden h-4 w-20 rounded sm:block" />
                    </span>
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    {/* "Câu x/N" counter */}
                    <Skeleton className="h-4 w-20 rounded" />
                    <span className="flex-1" />
                    {/* countdown timer */}
                    <Skeleton className="h-4 w-14 rounded" />
                </div>
                {/* progress-segment bar */}
                <div className="flex gap-1 px-4 pb-2 sm:px-6" role="presentation">
                    {Array.from({ length: PROGRESS_SEGMENTS }, (_, position) => (
                        <Skeleton key={position} className="h-1 flex-1 rounded-full" />
                    ))}
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6">
                {/* interviewer presence card — avatar + name/role + the question body */}
                <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-surface">
                    <div className="flex items-center gap-3">
                        <Skeleton.Avatar />
                        <div className="flex min-w-0 flex-col gap-1">
                            <Skeleton.Typography type="body-sm" width="1/3" />
                            <Skeleton.Typography type="body-xs" width="1/4" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-default pt-3">
                        <Skeleton.Typography type="body-sm" width="full" />
                        <Skeleton.Typography type="body-sm" width="full" />
                        <Skeleton.Typography type="body-sm" width="3/4" />
                        <Skeleton.Typography type="body-sm" width="1/2" />
                    </div>
                </div>

                {/* voice hero — big push-to-talk mic */}
                <div className="flex flex-col items-center gap-3">
                    <Skeleton className="size-20 shrink-0 rounded-full" />
                    <Skeleton.Typography type="body-sm" width="1/4" />
                </div>

                {/* answer action row — primary CTA + the quiet "finish early" link */}
                <div className="flex flex-col items-center gap-3">
                    <Skeleton.Button width="w-48" />
                    <Skeleton.Typography type="body-xs" width="1/4" />
                </div>
            </div>
        </div>
    )
}
