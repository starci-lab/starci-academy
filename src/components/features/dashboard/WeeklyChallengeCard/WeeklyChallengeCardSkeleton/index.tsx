"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/** Recent-finisher rows shown while the weekly challenge loads. */
const SKELETON_ROW_COUNT = 3

/** Props for {@link WeeklyChallengeCardSkeleton}. */
export type WeeklyChallengeCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").WeeklyChallengeCard}: mirrors the real
 * "Thử thách tuần" card — the same `LabeledCard` (label + flame) wrapping the title,
 * the countdown + status row, the passer count, and a short finisher list — so the
 * card does not pop in / jump when the weekly-challenge query resolves.
 *
 * @param props - {@link WeeklyChallengeCardSkeletonProps}
 */
export const WeeklyChallengeCardSkeleton = ({ className }: WeeklyChallengeCardSkeletonProps) => {
    const t = useTranslations()
    return (
        <LabeledCard
            label={t("weeklyChallenge.title")}
            className={className}
            contentClassName="flex flex-col gap-3"
        >
            {/* featured challenge title */}
            <Skeleton.Typography type="body-sm" width="2/3" />

            {/* countdown (left) + status chip (right) */}
            <div className="flex items-center justify-between gap-3">
                <Skeleton.Typography type="body-xs" width="1/3" />
                <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
            </div>

            {/* total passers */}
            <Skeleton.Typography type="body-xs" width="1/4" />

            {/* recent finishers — joined bordered SurfaceListCard (not loose rows) */}
            <SurfaceListCard bordered>
                {Array.from({ length: SKELETON_ROW_COUNT }).map((_row, index) => (
                    <SurfaceListCardItem key={index}>
                        <div className="flex items-center gap-3">
                            <Skeleton.Avatar size="sm" />
                            <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />
                            <Skeleton className="h-3 w-12 shrink-0 rounded-sm" />
                        </div>
                    </SurfaceListCardItem>
                ))}
            </SurfaceListCard>
        </LabeledCard>
    )
}
