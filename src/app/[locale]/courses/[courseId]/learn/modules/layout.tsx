"use client"

import React from "react"
import { Breadcrumbs, Skeleton, cn } from "@heroui/react"
import { ModuleSidebar } from "@/components/layouts/ModuleSidebar"
import { LearnPanelToggles } from "@/components/layouts/LearnPanelToggles"
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
    // collapsed → right rail shrinks to a slim numbered index instead of the full outline
    const rightCollapsed = useAppSelector((state) => state.sidebar.rightCollapsed)

    return (
        <div
            className={cn(
                "grid grid-cols-1 transition-[grid-template-columns] duration-300 ease-in-out",
                // two tracks always; the right track animates between the index strip and full width
                rightCollapsed ? "lg:grid-cols-[1fr_3.5rem]" : "lg:grid-cols-[1fr_20rem]",
            )}
        >
            {/* relative anchor for the absolutely-positioned collapse handles */}
            <div className="relative min-w-0 lg:border-r">
                {/* desktop-only collapse handles on the left + right borders */}
                <LearnPanelToggles />
                {/* breadcrumb capped + centered to match the 1024 reading column below */}
                <div className="mx-auto w-full max-w-[1024px] px-3 pt-3">
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
            </div>
            {/* right outline rail — stays mounted so it can shrink to the index strip (mobile: drawer) */}
            <ModuleSidebar
                collapsed={rightCollapsed}
                className="hidden min-w-0 overflow-x-hidden lg:block lg:self-start"
            />
        </div>
    )
}

export default Layout
