"use client"

import React from "react"
import {
    BookOpenIcon,
    MedalIcon,
    StackIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryPlatformStatsSwr } from "@/hooks"
import {
    AsyncContent,
    MetricCard,
    Skeleton,
} from "@/components/blocks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link StatStrip}. */
export type StatStripProps = WithClassNames<undefined>

/**
 * Live platform proof strip — four real counters (learners / lessons / courses /
 * badges) from the public `platformStats` query. Honest by design: on error it
 * hides entirely rather than rendering a strip of zeros. Container reads its own
 * SWR; placement only via className.
 *
 * @param props - optional className (placement only).
 */
export const StatStrip = ({ className }: StatStripProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error } = useQueryPlatformStatsSwr()

    // Never present zeros as proof — drop the whole strip when the fetch fails.
    if (error) {
        return null
    }

    const format = (value: number) => value.toLocaleString(locale)

    return (
        <div className={className}>
            <AsyncContent
                isLoading={isLoading && !data}
                skeleton={(
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[0, 1, 2, 3].map((cell) => (
                            <Skeleton key={cell} className="h-28 rounded-2xl" />
                        ))}
                    </div>
                )}
            >
                {data ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <MetricCard
                            icon={<UsersIcon aria-hidden focusable="false" className="size-5 text-accent" />}
                            value={format(data.totalLearners)}
                            label={t("landing.stats.learners")}
                        />
                        <MetricCard
                            icon={<BookOpenIcon aria-hidden focusable="false" className="size-5 text-accent" />}
                            value={format(data.totalLessons)}
                            label={t("landing.stats.lessons")}
                        />
                        <MetricCard
                            icon={<StackIcon aria-hidden focusable="false" className="size-5 text-accent" />}
                            value={format(data.totalCourses)}
                            label={t("landing.stats.courses")}
                        />
                        <MetricCard
                            icon={<MedalIcon aria-hidden focusable="false" className="size-5 text-accent" />}
                            value={format(data.totalBadgesEarned)}
                            label={t("landing.stats.badges")}
                        />
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}
