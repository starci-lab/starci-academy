"use client"

import React from "react"
import { Breadcrumbs, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks"

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const module = useAppSelector((state) => state.module.entity)
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const { isLoading: isCourseLoading } = useQueryCourseSwr()
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isCourseLoading || isModuleLoading || !module || !course

    // The content column shell (relative anchor, right border, collapse handles) and the
    // right module-outline rail now live in the shared learn layout, so this layout only
    // contributes the modules breadcrumb above the lesson article.
    return (
        <>
            {/* breadcrumb (tier 1) capped to the same reading width as the header + content below */}
            <div className="mx-auto w-full max-w-3xl px-3 pt-3">
                {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                            {t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                            {course?.title || t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            <span>{t("modules.title")}</span>
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                )}
            </div>
            {children}
        </>
    )
}

export default Layout
