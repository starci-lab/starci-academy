import React from "react"
import { Card, CardContent } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/**
 * Loading placeholder for {@link import("./index").FlashcardQuizResult} — mirrors its
 * REAL layout tree: HERO = 3 `MetricCard` tiles (`Skeleton.Metric`), then the
 * per-card breakdown (`LabeledCard` label → `SurfaceListCard` of status-dot · title ·
 * score-chip rows), then the weak-tags recap card (label → framed card of link rows),
 * so the surface never collapses or jumps when the session query resolves. Used on
 * the revisit-by-URL path (skeleton → result).
 */
export const FlashcardQuizResultSkeleton = () => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {/* HERO — 3 MetricCard tiles (value + label), each Skeleton.Metric shares the real card's box */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Skeleton.Metric />
                <Skeleton.Metric />
                <Skeleton.Metric />
            </div>

            {/* PER-CARD breakdown — LabeledCard label → SurfaceListCard of rows
                (status dot + card front + n/m score chip) */}
            <section className="flex flex-col gap-3">
                <Skeleton className="h-[14px] w-40 rounded" />
                <SurfaceListCard>
                    {Array.from({ length: 5 }).map((_unused, index) => (
                        <SurfaceListCardItem key={index}>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-2.5 shrink-0 rounded-full" />
                                <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />
                                <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
                            </div>
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            </section>

            {/* weak-tags recap card — LabeledCard label → framed card of "review this lesson" link rows */}
            <section className="flex flex-col gap-3">
                <Skeleton className="h-[14px] w-40 rounded" />
                <Card>
                    <CardContent className="flex flex-col gap-2">
                        {Array.from({ length: 3 }).map((_unused, index) => (
                            <Skeleton key={index} className="h-16 w-full rounded-xl" />
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
