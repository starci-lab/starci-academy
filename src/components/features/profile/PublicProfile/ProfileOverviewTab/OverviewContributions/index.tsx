"use client"

import React, { useState } from "react"
import { FlameIcon as FireIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { ContributionCalendarView } from "@/components/features/profile/ContributionCalendarView"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { useQueryUserContributionCalendarSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserContributionCalendarSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserWeeklyStatsSwr"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Overview content — the contribution heatmap (GitHub-style) + the streak line
 * (current / longest). Content only (no card): the parent `LabeledCard` supplies
 * the frame.
 *
 * The calendar owns its own resting state, so there is no placeholder copy of its
 * shape here — only the streak line, which belongs to this block, shimmers on its
 * own (`loading-and-skeleton.md`).
 */
export const OverviewContributions = () => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null

    const [year, setYear] = useState(() => new Date().getFullYear())
    const { data, isLoading, error, mutate } = useQueryUserContributionCalendarSwr(userId, year)
    const { data: weekly } = useQueryUserWeeklyStatsSwr(userId)

    const days = data ?? []
    // first load, nothing in hand: no user resolved yet, or the calendar still in flight
    const isSkeleton = (isLoading || !userId) && days.length === 0

    // error beats a stale loading flag — but only a settled failure with nothing cached.
    if (error && days.length === 0) {
        return (
            <AsyncContentError
                title={t("publicProfile.loadError")}
                onRetry={() => { void mutate() }}
                retryLabel={t("publicProfile.loadErrorRetry")}
            />
        )
    }

    return (
        <StackV
            identity={{ tier: "block", component: "OverviewContributions" }}
            gap={4}
            items={[
                () => (
                    <ContributionCalendarView
                        isSkeleton={isSkeleton}
                        days={days}
                        year={year}
                        onYearChange={setYear}
                    />
                ),
                () => (
                    <StackH
                        gap={3}
                        align="center"
                        items={[
                            () => (
                                <FireIcon
                                    aria-hidden
                                    focusable="false"
                                    className="size-5 text-accent-soft-foreground"
                                />
                            ),
                            () => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    isSkeleton={isSkeleton}
                                    text={t("profile.streakLine", {
                                        streak: weekly?.streak ?? 0,
                                        longest: weekly?.longestStreak ?? 0,
                                    })}
                                />
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )
}
