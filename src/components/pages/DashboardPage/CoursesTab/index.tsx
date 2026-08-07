"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    MyCoursesProgress,
} from "./MyCoursesProgress"
import {
    RecommendedCourses,
} from "../RecommendedCourses"
import {
    UpcomingLivestreamCard,
} from "../UpcomingLivestreamCard"
/** Props for {@link CoursesTab}. */
export type CoursesTabProps = Record<string, never>
/**
 * DashboardPage "Courses" tab — everything about the viewer's learning path: enrolled-
 * course progress, recommended courses to pick up next, and upcoming live sessions.
 * Each child self-fetches its own leaf query.
 * @param props - optional root class name (placement only)
 */
export const CoursesTab = () => {
    const t = useTranslations()
    return (
        <div className={"flex flex-col gap-6"}>
            <MyCoursesProgress
                label={t("DashboardPage.enrolledCourses")}
            />
            <RecommendedCourses />
            <UpcomingLivestreamCard />
        </div>
    )
}
