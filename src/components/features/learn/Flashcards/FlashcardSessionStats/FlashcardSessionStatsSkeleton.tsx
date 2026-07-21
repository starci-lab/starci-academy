import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/**
 * Loading placeholder for {@link import("./index").FlashcardSessionStats} — mirrors its
 * REAL layout tree: HERO `SectionCard` holds ONLY the 4 grade-distribution rows
 * (label · meter · count) + a rollup line (its title/subtitle live in the PageHeader
 * OUTSIDE this AsyncContent), then the metric tiles (`Skeleton.Metric` grid) and the
 * weak-tags `SurfaceListCard`, so the surface never collapses or jumps when the stats
 * query resolves. Used on the revisit-by-URL path (skeleton → stats).
 */
export const FlashcardSessionStatsSkeleton = () => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {/* HERO — the 4-grade SM-2 distribution + a rollup line (NO title/subtitle:
                those sit in the PageHeader above this AsyncContent) */}
            <SectionCard contentClassName="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_unused, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="h-[14px] w-16 shrink-0 rounded" />
                            <Skeleton.ProgressBar className="flex-1" />
                            <Skeleton className="h-[14px] w-16 shrink-0 rounded" />
                        </div>
                    ))}
                </div>
                {/* subtle secondary rollup */}
                <Skeleton.Typography type="body-xs" width="1/2" />
            </SectionCard>

            {/* session metric tiles — LabeledCard label → 4 MetricCard grid */}
            <section className="flex flex-col gap-3">
                <Skeleton className="h-[14px] w-28 rounded" />
                <div className="grid grid-cols-2 gap-3 @app-sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_unused, index) => (
                        <Skeleton.Metric key={index} />
                    ))}
                </div>
            </section>

            {/* most-forgotten tags — LabeledCard label → SurfaceListCard rows (icon + tag + forgot chip) */}
            <section className="flex flex-col gap-3">
                <Skeleton className="h-[14px] w-40 rounded" />
                <SurfaceListCard>
                    {Array.from({ length: 3 }).map((_unused, index) => (
                        <SurfaceListCardItem key={index}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Skeleton className="size-4 shrink-0 rounded" />
                                    <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />
                                </div>
                                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                            </div>
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            </section>
        </div>
    )
}
