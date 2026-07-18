import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/**
 * Loading placeholder for {@link import("./index").FlashcardSessionStats} — mirrors
 * its layout tree (hero grade-distribution card → 4 metric tiles → a supporting
 * card) so the surface never collapses or jumps when the stats query resolves.
 * Used on the revisit-by-URL path (skeleton → stats), per the flow proposal.
 */
export const FlashcardSessionStatsSkeleton = () => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {/* hero: title + 4 grade bars */}
            <div className="flex flex-col gap-4 rounded-3xl border border-default bg-surface p-4">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-full max-w-sm rounded-lg" />
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-16 shrink-0 rounded-lg" />
                            <Skeleton className="h-2.5 flex-1 rounded-full" />
                            <Skeleton className="h-4 w-14 shrink-0 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>

            {/* metric tiles */}
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-28 rounded-lg" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-full rounded-3xl" />
                    ))}
                </div>
            </div>

            {/* supporting card (weak tags / study) */}
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
        </div>
    )
}
