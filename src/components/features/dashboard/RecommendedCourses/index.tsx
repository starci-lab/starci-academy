"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    BookOpenIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryRecommendedCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryRecommendedCoursesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"

/** Props for {@link RecommendedCourses}. */
export type RecommendedCoursesProps = WithClassNames<undefined>

/**
 * "Khóa học cho bạn" — courses the viewer has NOT bought yet, each priced with
 * their engagement-based loyalty discount (an exclusive offer for diligent / multi-
 * course learners; the discounted price is the price actually charged). One framed
 * `LabeledCard` with a flat row per course — the TITLE is the link into the course
 * (not a whole-card press, matching "my courses"). Hides when nothing's left to
 * recommend. Self-fetches its leaf query.
 * @param props - optional className for the root element.
 */
export const RecommendedCourses = ({
    className,
}: RecommendedCoursesProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error, mutate } = useQueryRecommendedCoursesSwr()
    const items = data?.items ?? []

    // bought everything (loaded, no items, no error) → hide the whole section
    if (!isLoading && !error && items.length === 0) {
        return null
    }
    // `frameless` computed here (not hardcoded) so the loaded list — self-framed
    // as a `SurfaceListCard` — skips the outer `Card`, mirroring `MyCoursesProgress`.
    const hasItems = !isLoading && !error && items.length > 0

    return (
        <LabeledCard
            label={t("dashboard.recommended.title")}
            className={className}
            frameless={hasItems}
        >
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1, 2].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-12 shrink-0 rounded-xl" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <Skeleton.Typography type="body-sm" width="1/2" />
                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                )}
                error={items.length === 0 ? error : undefined}
                errorContent={{
                    title: t("dashboard.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("dashboard.retry"),
                }}
            >
                <SurfaceListCard>
                    {items.map((course) => {
                        const discounted = course.discountPercent > 0
                        return (
                            <SurfaceListCardItem
                                key={course.displayId}
                                href={pathConfig().locale(locale).course(course.displayId).build()}
                                hover="underline"
                            >
                                <div className="flex items-center gap-3">
                                    <IconTile
                                        size="sm"
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        {/* whole-row link → title underlines on CARD hover, decoration = text colour
                                            (foreground). NOT a nested EntityToken/<Link> (that hovers only on the label
                                            + draws an accent-coloured underline). Matches "my courses" CourseRow. */}
                                        <Typography
                                            type="body-sm"
                                            weight="medium"
                                            truncate
                                            className="min-w-0 flex-1 text-accent-soft-foreground underline-offset-2 group-hover:underline"
                                        >
                                            {course.title}
                                        </Typography>
                                        {course.description ? (
                                            <Typography type="body-xs" color="muted" truncate>
                                                {course.description}
                                            </Typography>
                                        ) : null}
                                        <PriceTag
                                            discounted={course.discountedPriceVnd}
                                            original={discounted ? course.originalPriceVnd : null}
                                            size="sm"
                                        />
                                        {discounted && course.discountReason !== "none" ? (
                                            <Typography type="body-xs" className="text-accent-soft-foreground">
                                                {t(`dashboard.recommended.reason.${course.discountReason}`, {
                                                    count: course.enrolledCount,
                                                })}
                                            </Typography>
                                        ) : null}
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        )
                    })}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
