"use client"

import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
    cn,
} from "@heroui/react"
import {
    useTranslations,
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources"
import {
    useAppSelector,
} from "@/redux"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MindMapBreadcrumbs}. */
export type MindMapBreadcrumbsProps = WithClassNames<undefined>

/**
 * Breadcrumb trail for the course mind-map screen
 * (Home → Courses → Course → Mind map).
 *
 * Self-contained: reads the course title and display id from redux, owns its
 * navigation handlers (router pushes built from {@link pathConfig}).
 *
 * Client component: uses the router, i18n hooks, and interactive handlers.
 * @param props - optional className for the root element
 */
export const MindMapBreadcrumbs = ({
    className,
}: MindMapBreadcrumbsProps = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseTitle = useAppSelector((state) => state.course.entity?.title)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    /** Navigate to the localized home page. */
    const onPressHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )

    /** Navigate to the course listing for the active locale. */
    const onPressCourses = useCallback(
        () => router.push(pathConfig().locale(locale).course().build()),
        [
            router,
            locale,
        ],
    )

    /** Navigate to the current course's detail page. */
    const onPressCourse = useCallback(
        () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        [
            router,
            locale,
            courseDisplayId,
        ],
    )

    return (
        <Breadcrumbs className={cn(className)}>
            <Breadcrumbs.Item onPress={onPressHome}>
                {t("nav.home")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item onPress={onPressCourses}>
                {t("nav.courses")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item onPress={onPressCourse}>
                {courseTitle || t("nav.courses")}
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
                <span>{t("mindMap.title")}</span>
            </Breadcrumbs.Item>
        </Breadcrumbs>
    )
}
