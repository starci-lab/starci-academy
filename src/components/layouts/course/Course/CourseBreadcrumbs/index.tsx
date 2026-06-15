"use client"

import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
    Skeleton,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    pathConfig,
} from "@/resources"
import type {
    WithClassNames,
} from "@/modules/types"

/**
 * CourseBreadcrumbs props — only class-name plumbing (self-contained section).
 */
export type CourseBreadcrumbsProps = WithClassNames<undefined>

/**
 * Breadcrumb trail for the course detail page (Home / Courses / current title).
 *
 * Self-contained section (single-use): reads its own load flag (course SWR
 * singleton), course title (redux) and owns its navigation handlers (router +
 * locale), so the course container renders `<CourseBreadcrumbs />` with no
 * props. Shows a skeleton while loading, otherwise the trail. `"use client"`
 * because HeroUI `Breadcrumbs` is interactive and it reads redux/router.
 */
export const CourseBreadcrumbs = (props: CourseBreadcrumbsProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const { isLoading } = useQueryCourseSwr()
    const title = useAppSelector((state) => state.course.entity?.title)

    /** Navigate to the home page. */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [router],
    )
    /** Navigate to the courses listing page. */
    const onNavigateCourses = useCallback(
        () => router.push(pathConfig().locale(locale).course().build()),
        [router, locale],
    )

    if (isLoading) {
        return <Skeleton className={cn("w-30 h-5", props.className)} />
    }
    return (
        <Breadcrumbs className={props.className}>
            <Breadcrumbs.Item onPress={onNavigateHome}>
                {t("nav.home")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item onPress={onNavigateCourses}>
                {t("nav.courses")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
                <span>{title}</span>
            </Breadcrumbs.Item>
        </Breadcrumbs>
    )
}
