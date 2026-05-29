"use client"

import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
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

/** Props for {@link MindMapBreadcrumbs}. */
export interface MindMapBreadcrumbsProps {
    /** Course title shown as the current course crumb (falls back to a label). */
    courseTitle?: string
    /** Course display id used to build the course detail path. */
    courseDisplayId?: string
}

/**
 * Breadcrumb trail for the course mind-map screen
 * (Home → Courses → Course → Mind map).
 *
 * Owns the navigation handlers (router pushes built from {@link pathConfig});
 * the active course crumb is passed in as props.
 *
 * Client component: uses the router and i18n hooks plus interactive handlers.
 */
export const MindMapBreadcrumbs = ({
    courseTitle,
    courseDisplayId,
}: MindMapBreadcrumbsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

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
        <Breadcrumbs>
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
                <span>{t("content.mindMapAria")}</span>
            </Breadcrumbs.Item>
        </Breadcrumbs>
    )
}
