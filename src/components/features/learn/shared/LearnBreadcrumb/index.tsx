"use client"

import React from "react"
import type { ReactNode } from "react"
import { Breadcrumbs } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"

/** Props for {@link LearnBreadcrumb}. */
export interface LearnBreadcrumbProps {
    /**
     * The final (current page) crumb — read-only, no navigation. OMIT on the course-learn home
     * (then `<course>` itself is the last read-only crumb instead of a link).
     */
    current?: ReactNode
}

/**
 * Shared page breadcrumb for the course-learn tabs: Home › Courses › <course> › {current}.
 *
 * Self-contained (reads the active course from Redux + owns its routing), so any learn page can
 * drop it in — render it INSIDE the page's reading column / `PageHeader` `breadcrumb` slot so it
 * shares that column's padding + cap (no separate padded wrapper). Only the last crumb varies.
 *
 * @param props - {@link LearnBreadcrumbProps}
 */
export const LearnBreadcrumb = ({ current }: LearnBreadcrumbProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                {t("nav.home")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                {t("nav.courses")}
            </Breadcrumbs.Item>
            {current != null ? (
                <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                    {course?.title || t("nav.courses")}
                </Breadcrumbs.Item>
            ) : (
                <Breadcrumbs.Item>{course?.title || t("nav.courses")}</Breadcrumbs.Item>
            )}
            {current != null ? <Breadcrumbs.Item>{current}</Breadcrumbs.Item> : null}
        </Breadcrumbs>
    )
}

export default LearnBreadcrumb
