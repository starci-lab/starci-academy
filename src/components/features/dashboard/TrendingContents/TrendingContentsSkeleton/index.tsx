"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    FlameIcon,
} from "@phosphor-icons/react"
import {
    LabeledCard,
    Skeleton,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Number of placeholder rows shown while trending contents load. */
const SKELETON_ROW_COUNT = 5

/** Per-row token widths (varied so the list reads naturally, not a solid block). */
const ROW_WIDTHS = ["3/4", "1/2", "1/3", "3/4", "1/2"] as const

/** Props for {@link TrendingContentsSkeleton}. */
export type TrendingContentsSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").TrendingContents}: mirrors the real
 * "Nổi bật tuần này" card — the same `LabeledCard` (label + flame icon) wrapping a
 * `gap-3` column of rows, each a token (left) + read-count (right) — so the card
 * does not pop in / jump when the trending query resolves.
 *
 * @param props - {@link TrendingContentsSkeletonProps}
 */
export const TrendingContentsSkeleton = ({ className }: TrendingContentsSkeletonProps) => {
    const t = useTranslations()
    return (
        <LabeledCard
            className={className}
            label={t("dashboard.trending.title")}
            icon={<FlameIcon aria-hidden focusable="false" className="size-5 text-accent" />}
        >
            <div className="flex flex-col gap-3">
                {ROW_WIDTHS.slice(0, SKELETON_ROW_COUNT).map((width, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                        <Skeleton.Typography type="body-sm" width={width} />
                        <Skeleton className="h-4 w-16 shrink-0 rounded-md" />
                    </div>
                ))}
            </div>
        </LabeledCard>
    )
}
