"use client"

import React from "react"
import { Breadcrumbs, Skeleton } from "@heroui/react"
import { ModuleSidebar } from "@/components/layouts"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks/singleton"

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="col-span-2 lg:border-r lg:border-divider/60">
                <div className="px-3 pt-3">
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
            <ModuleSidebar className="col-span-1 lg:self-start" />
        </div>
    )
}

export default Layout
