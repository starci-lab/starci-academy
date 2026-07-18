"use client"

import React from "react"
import {
    Card,
    CardContent,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { ProfileHeroSkeleton } from "../ProfileHero/ProfileHeroSkeleton"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/** Props for {@link ProfileLoadingState}. */
export type ProfileLoadingStateProps = WithClassNames<undefined>

/**
 * First-load skeleton for the public profile, shaped to MIRROR the real shell so
 * the layout never jumps on resolve. LEFT = the real {@link ProfileHeroSkeleton}
 * (reused, not re-hand-rolled). RIGHT = the OVERVIEW tab's real sections, each a
 * label + its own skeleton body: job-readiness (`Skeleton.Metric` + track card),
 * courses list (`IconTile size-12 rounded-xl` + title/percent + progress rows),
 * contributions (heatmap + streak line), then the 2-col skills grid — matching
 * `ProfileJobReadiness` / `OverviewCourses` / `OverviewContributions` /
 * `OverviewChallengeSkills`+`OverviewCodeSkills`. (Was wrong: 3 generic `h-40`
 * boxes + a hand-rolled identity with a phantom bio.)
 *
 * @param props - {@link ProfileLoadingStateProps}
 */
export const ProfileLoadingState = ({
    className,
}: ProfileLoadingStateProps) => {
    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"
            className={cn("flex w-full flex-col", className)}
        >
            {/* tab strip (full-width, under the navbar) */}
            <div className="w-full px-6 py-3">
                <div className="flex gap-6">
                    {[0, 1, 2, 3, 4].map((tab) => (
                        <Skeleton key={tab} className="h-6 w-24 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* 2-col body: left identity BARE · right overview sections */}
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-6 md:flex-row md:items-start">
                {/* left: identity column — reuse the real hero skeleton */}
                <aside className="flex w-full flex-col gap-4 md:w-72 md:shrink-0">
                    <ProfileHeroSkeleton />
                </aside>

                {/* right: labelled overview sections (each = label + section skeleton body) */}
                <main className="flex min-w-0 flex-1 flex-col gap-6">
                    {/* job readiness — Skeleton.Metric headline + track card */}
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-40 rounded-xl" />
                        <div className="flex flex-col gap-3">
                            <Skeleton.Metric />
                            <SurfaceListCard>
                                <SurfaceListCardItem>
                                    <div className="flex flex-col gap-3">
                                        <Skeleton.Typography type="body-sm" width="1/2" />
                                        <Skeleton.ProgressBar />
                                        <Skeleton.ProgressBar />
                                    </div>
                                </SurfaceListCardItem>
                            </SurfaceListCard>
                        </div>
                    </div>

                    {/* courses — IconTile (size-12 rounded-xl) + title/percent + progress rows */}
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-40 rounded-xl" />
                        <SurfaceListCard>
                            {[0, 1].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-12 shrink-0 rounded-xl" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <Skeleton.Typography type="body-sm" width="1/2" />
                                                <Skeleton className="h-3 w-8 rounded" />
                                            </div>
                                            <Skeleton.ProgressBar />
                                        </div>
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </div>

                    {/* contributions — heatmap grid + streak line */}
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-40 rounded-xl" />
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-4 shrink-0 rounded-full" />
                                <Skeleton.Typography type="body-sm" width="1/2" />
                            </div>
                        </div>
                    </div>

                    {/* skills — 2-col grid of stat cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {[0, 1].map((cardIndex) => (
                            <div key={cardIndex} className="flex flex-col gap-3">
                                <Skeleton className="h-5 w-40 rounded-xl" />
                                <Card>
                                    <CardContent>
                                        <Skeleton.Metric />
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
