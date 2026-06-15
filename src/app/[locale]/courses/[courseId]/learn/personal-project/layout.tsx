"use client"

import React from "react"
import { Breadcrumbs } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { useQueryMilestonesSwr } from "@/hooks"
import { PersonalProjectSubmission } from "@/components/layouts/profile/PersonalProjectSubmission"
import { Task } from "@/components/layouts/learn/Task"

const Layout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    // Load the milestones list here (not only inside MilestoneSidebar): the milestone
    // rail now lives in the shared learn layout and is hidden when the right rail is
    // collapsed, but the task body + default-task redirect still depend on
    // `milestone.entities`, so the fetch must run regardless of the rail's visibility.
    useQueryMilestonesSwr()

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
