"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    Spacer,
} from "@/components/reuseable"
import {
    CourseCard,
} from "./CourseCard"

/**
 * Featured courses grid container.
 *
 * Pulls the course list from redux and renders a responsive grid of cards.
 * `"use client"` for the redux selector and next-intl translations.
 */
export const Courses = () => {
    const courses = useAppSelector((state) => state.course.entities)
    const t = useTranslations()

    /** Course list to render (empty until the courses are loaded). */
    const list = useMemo(
        () => courses ?? [],
        [courses],
    )

    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl font-bold flex gap-1 text-center">{t("courses.featuredTitle")}</div>
            <Spacer y={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}
