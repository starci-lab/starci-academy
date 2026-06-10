"use client"

import React from "react"
import { Breadcrumbs } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { PersonalProjectSubmission } from "@/components/layouts/PersonalProjectSubmission"
import { Task } from "@/components/layouts/Task"

const Layout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    // The right rail is now the shared module-outline rail provided by the learn layout
    // (no longer the milestone-specific sidebar), so this layout only renders the
    // breadcrumb + project submission + task body inside the content column.
    return (
        <>
            <div className="p-3">
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
                        <span>{t("course.finalProjectTitle")}</span>
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </div>
            <PersonalProjectSubmission />
            <Task />
        </>
    )
}

export default Layout
