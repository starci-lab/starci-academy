"use client"

import React from "react"
import { Breadcrumbs } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"

const CvPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    return (
        <div>
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
                    <span>{t("course.cvTitle")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>

            <div className="h-12" />

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">{course?.title}</h1>
                    <p className="text-muted mt-2">{t("course.cvDescription")}</p>
                </div>

                <div className="flex min-h-[min(360px,50vh)] items-center justify-center rounded-2xl border border-divider bg-background/50 px-4 py-10 text-center text-sm text-muted dark:border-zinc-600 dark:bg-background/70">
                    {t("course.cvPlaceholder")}
                </div>
            </div>
        </div>
    )
}

export default CvPage
