"use client"

import React, { useCallback, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { _CourseCard, type CourseCardProps } from "./component"

/** Props the connected {@link CourseCard} takes from its caller — everything except the resolved labels/handlers `component.tsx` derives internally. */
export type CourseCardConnectedProps = Omit<
    CourseCardProps,
    "viewLabel" | "viewCourseLabel" | "learnersLabel" | "priceUsdHintLabel" | "onView" | "onViewDetail"
>

/**
 * Featured course card — the CONNECTED half: resolves the CTA/chip labels via
 * `t()`, derives the marketing/learn routes from `course.displayId` + locale,
 * and hands fully-resolved props to the presentational {@link _CourseCard}.
 * See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link CourseCardConnectedProps}
 */
export const CourseCard = (props: CourseCardConnectedProps) => {
    const { course } = props
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()

    // enrolled → the marketing/detail page is the wrong destination for the PRIMARY
    // action (the viewer already owns this course); route straight into the
    // learning experience instead, mirroring
    // CourseDetail's `useCourseEnrollment().onContinueLearning`.
    const isEnrolled = course.isEnrolled === true
    const marketingHref = pathConfig().locale(locale).course(course.displayId).build()
    const learnHref = pathConfig().locale(locale).course(course.displayId).learn().content().build()
    const onView = useCallback(
        () => router.push(isEnrolled ? learnHref : marketingHref),
        [router, isEnrolled, learnHref, marketingHref],
    )
    const onViewDetail = useCallback(
        () => router.push(marketingHref),
        [router, marketingHref],
    )
    const viewLabel = isEnrolled ? t("course.continueLearning") : t("courses.viewCourse")
    const viewCourseLabel = t("courses.viewCourse")
    const learnersLabel = course.enrollmentCount > 0
        ? t("courses.learners", { count: course.enrollmentCount })
        : undefined

    /** USD price of the active phase, falling back to the list USD price. */
    const actualPriceUsd = useMemo(
        () => course.pricingPhases?.find(
            (pricingPhase) => pricingPhase.phase === course.currentPhase,
        )?.priceUsd ?? course.originalPriceUsd ?? null,
        [course.pricingPhases, course.currentPhase, course.originalPriceUsd],
    )
    /** Formatted USD price for display, or `null` to hide the USD line. */
    const formattedPriceUsd = useMemo(
        () => actualPriceUsd != null
            // charm-round to x.99 (mirror the backend USD price)
            ? (Math.max(1, Math.ceil(actualPriceUsd)) - 0.01).toLocaleString("en-US", { style: "currency", currency: "USD" })
            : null,
        [actualPriceUsd],
    )
    const priceUsdHintLabel = formattedPriceUsd != null
        ? t("course.priceUsdHint", { amount: formattedPriceUsd })
        : undefined

    return (
        <_CourseCard
            {...props}
            viewLabel={viewLabel}
            viewCourseLabel={viewCourseLabel}
            learnersLabel={learnersLabel}
            priceUsdHintLabel={priceUsdHintLabel}
            onView={onView}
            onViewDetail={onViewDetail}
        />
    )
}
