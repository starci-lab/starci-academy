"use client"

import React, {
    useCallback,
} from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    CompassIcon,
    BookOpenIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryRecommendedCoursesSwr,
} from "@/hooks"
import {
    AsyncContent,
    IconTile,
    LabeledCard,
    PressableCard,
    Skeleton,
} from "@/components/blocks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link RecommendedCourses}. */
export type RecommendedCoursesProps = WithClassNames<undefined>

/** Format a VND amount with the vi-VN grouping + đồng sign. */
const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")}₫`

/**
 * "Khóa học cho bạn" — courses the viewer has NOT bought yet, each priced with
 * their engagement-based loyalty discount (an exclusive offer for diligent / multi-
 * course learners; the discounted price is the price actually charged). Owns its
 * `LabeledCard` (frameless — items are cards) and hides entirely when there's
 * nothing left to recommend. Self-fetches its leaf query.
 * @param props - optional className for the root element.
 */
export const RecommendedCourses = ({
    className,
}: RecommendedCoursesProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading, error, mutate } = useQueryRecommendedCoursesSwr()
    const items = data?.items ?? []

    /** Open a course detail page. */
    const onOpen = useCallback(
        (displayId: string) => router.push(pathConfig().locale(locale).course(displayId).build()),
        [
            router,
            locale,
        ],
    )

    // bought everything (loaded, no items, no error) → hide the whole section
    if (!isLoading && !error && items.length === 0) {
        return null
    }

    return (
        <LabeledCard
            label={t("dashboard.recommended.title")}
            icon={<CompassIcon aria-hidden focusable="false" className="size-5" />}
            className={className}
            frameless
        >
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-3">
                        {[0, 1, 2].map((row) => (
                            <Skeleton key={row} className="h-20 w-full rounded-3xl" />
                        ))}
                    </div>
                )}
                error={items.length === 0 ? error : undefined}
                errorContent={{
                    title: t("dashboard.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("dashboard.retry"),
                }}
            >
                <div className="flex flex-col gap-3">
                    {items.map((course) => {
                        const discounted = course.discountPercent > 0
                        return (
                            <PressableCard
                                key={course.displayId}
                                onPress={() => onOpen(course.displayId)}
                            >
                                <div className="flex items-center gap-3">
                                    <IconTile
                                        size="sm"
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <Typography type="body-sm" weight="medium" truncate>
                                                {course.title}
                                            </Typography>
                                            {discounted ? (
                                                <Chip color="danger" variant="soft" size="sm">
                                                    <Chip.Label>{`-${course.discountPercent}%`}</Chip.Label>
                                                </Chip>
                                            ) : null}
                                        </div>
                                        {course.description ? (
                                            <Typography type="body-xs" color="muted" truncate>
                                                {course.description}
                                            </Typography>
                                        ) : null}
                                        <div className="flex items-center gap-2">
                                            <Typography type="body-sm" weight="medium">
                                                {formatVnd(course.discountedPriceVnd)}
                                            </Typography>
                                            {discounted ? (
                                                <Typography type="body-xs" color="muted" className="line-through">
                                                    {formatVnd(course.originalPriceVnd)}
                                                </Typography>
                                            ) : null}
                                        </div>
                                        {discounted && course.discountReason !== "none" ? (
                                            <Typography type="body-xs" className="text-accent">
                                                {t(`dashboard.recommended.reason.${course.discountReason}`, {
                                                    count: course.enrolledCount,
                                                })}
                                            </Typography>
                                        ) : null}
                                    </div>
                                </div>
                            </PressableCard>
                        )
                    })}
                </div>
            </AsyncContent>
        </LabeledCard>
    )
}
