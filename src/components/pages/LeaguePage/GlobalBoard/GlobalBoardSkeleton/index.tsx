"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Number of placeholder rows (rank 4+) shown while the global leaderboard loads. */
const SKELETON_ROW_COUNT = 6

/** Props for {@link GlobalBoardSkeleton}. */
export type GlobalBoardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").GlobalBoard}: mirrors the real board
 * shell — the `StandingHeroCard` (badge + rank line + meta + goal meter + CTA), the
 * top-3 `Podium` dais, then rank-4+ rows inside a `SurfaceCardList`
 * [rank · avatar · name · points]. (Was wrong: no hero, no podium, loose rows.)
 *
 * @param props - {@link GlobalBoardSkeletonProps}
 */
export const GlobalBoardSkeleton = ({ className }: GlobalBoardSkeletonProps) => {
    const rowItems: Array<SurfaceCardListItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => ({
        key: `skeleton-${index}`,
        content: () => (
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center" items={[
                    () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                    () => <Skeleton.Avatar size="sm" />,
                    () => <Skeleton.Typography type="body-sm" width="1/3" className="min-w-0 flex-1" />,
                    () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                ]} />
        ),
    }))

    return (
        <Box identity={{ tier: "page", component: "GlobalBoardSkeleton" }} className={cn(className)}>
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <Box principle="card-padding" className="rounded-3xl bg-surface p-4 shadow-surface"
                            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                            <StackV gap={5} principle="group-boundary"
                                explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                                items={[
                                    () => (
                                        <StackH gap={5} principle="group-boundary"
                                            explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                                            align="center" items={[
                                                () => <Skeleton className="size-10 shrink-0 rounded-2xl" />,
                                                () => (
                                                    <StackV gap={2} principle="title-subtitle"
                                                        explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                        classNames={["min-w-0", "flex-1"]} items={[
                                                            () => <Skeleton.Typography type="h6" width="1/2" />,
                                                            () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                                        ]} />
                                                ),
                                            ]} />
                                    ),
                                    () => (
                                        <StackV gap={2} principle="title-subtitle"
                                            explain="Title over supporting line — not label-field, because neither line is a form control label."
                                            items={[
                                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                                () => <Skeleton.ProgressBar />,
                                            ]} />
                                    ),
                                    () => <Skeleton className="h-10 w-40 rounded-full" />,
                                ]} />
                        </Box>
                    ),
                    () => (
                        <StackH gap={4} principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            align="end" justify="center" items={[false, true, false].map((isChampion) => () => (
                                <StackV gap={3} principle="sibling-stack"
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    align="center" items={[
                                        () => <Skeleton className={cn("shrink-0 rounded-full", isChampion ? "size-14" : "size-12")} />,
                                        () => (
                                            <Box className="w-20">
                                                <StackV gap={2} principle="title-subtitle"
                                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                    align="center" items={[
                                                        () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                                        () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                                    ]} />
                                            </Box>
                                        ),
                                        () => <Skeleton className={cn("w-20 rounded-t-2xl rounded-b-none", isChampion ? "h-16" : "h-10")} />,
                                    ]} />
                            ))} />
                    ),
                    () => (
                        <SurfaceCardList items={rowItems} />
                    ),
                ]} />
        </Box>
    )
}
