"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    AsyncContent,
    Skeleton,
} from "@/components/blocks"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    CourseHero,
} from "./CourseHero"
import {
    CourseValueProps,
} from "./CourseValueProps"
import {
    CourseCurriculum,
} from "./CourseCurriculum"
import {
    CoursePrerequisites,
} from "./CoursePrerequisites"
import {
    CourseFaq,
} from "./CourseFaq"
import {
    CoursePricingRail,
} from "./CoursePricingRail"
import {
    CourseMobileEnrollBar,
} from "./CourseMobileEnrollBar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseDetail}. */
export type CourseDetailProps = WithClassNames<undefined>

/**
 * Marketing-first course landing (UI 2.0): a full-width hero (value + social proof
 * + CTA above the fold), then a two-column body — narrative on the left
 * (what-you'll-learn → curriculum → before-you-start → FAQ) and a sticky pricing
 * rail on the right — plus a mobile sticky enroll bar. The whole page is gated on
 * one course fetch; each section reads the hydrated course from redux and hides
 * when its data is empty. Replaces the legacy `layouts/course/Course`.
 *
 * The route param `[courseId]` is synced into `course.displayId` globally by
 * `useSyncReduxCourseId`, which drives {@link useQueryCourseSwr}.
 *
 * @param props - optional className (placement only).
 */
export const CourseDetail = ({ className }: CourseDetailProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const course = useAppSelector((state) => state.course.entity)

    return (
        <div className={className}>
            <div className="mx-auto w-full max-w-6xl px-6 py-6 pb-24 md:pb-6">
                <AsyncContent
                    isLoading={isLoading && !course}
                    skeleton={(
                        <div className="flex flex-col gap-10">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="flex flex-col gap-6">
                                    <Skeleton.Typography type="h2" />
                                    <Skeleton.Typography type="body" />
                                    <Skeleton.Metric />
                                    <Skeleton.Button />
                                </div>
                                <Skeleton.Card />
                            </div>
                            <Skeleton.Accordion items={3} />
                        </div>
                    )}
                    isEmpty={!isLoading && !error && !course}
                    emptyContent={{ title: t("courseLanding.notFound") }}
                    error={error}
                    errorContent={{
                        title: t("courseLanding.errorTitle"),
                        onRetry: () => mutate(),
                        retryLabel: t("courseLanding.retry"),
                    }}
                >
                    <div className="flex flex-col gap-10">
                        <CourseHero />
                        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
                            {/* narrative left on desktop; the purchase card comes FIRST on mobile */}
                            <div className="order-2 flex flex-col gap-6 md:order-1 md:col-span-2">
                                <CourseValueProps />
                                <CourseCurriculum />
                                <CoursePrerequisites />
                                <CourseFaq />
                            </div>
                            <CoursePricingRail className="order-1 md:order-2 md:col-span-1" />
                        </div>
                        {/* mobile-only sticky enroll bar (renders only with a loaded course) */}
                        <CourseMobileEnrollBar className="md:hidden" />
                    </div>
                </AsyncContent>
            </div>
        </div>
    )
}
