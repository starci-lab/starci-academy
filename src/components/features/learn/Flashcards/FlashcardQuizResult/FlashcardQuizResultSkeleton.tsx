import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/**
 * Loading placeholder for {@link import("./index").FlashcardQuizResult} — mirrors its
 * layout tree (3 hero metric tiles → per-card breakdown list → a supporting card) so
 * the surface never collapses or jumps when the session query resolves. Used on the
 * revisit-by-URL path (skeleton → result).
 */
export const FlashcardQuizResultSkeleton = () => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {/* hero: 3 metric tiles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-3xl" />
                ))}
            </div>

            {/* per-card breakdown list */}
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full rounded-xl" />
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
