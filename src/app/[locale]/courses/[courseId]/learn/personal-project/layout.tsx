"use client"

import React, { PropsWithChildren } from "react"
import { Breadcrumbs } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { MilestoneSidebar } from "@/components/layouts/MilestoneSidebar"
import { PersonalProjectSubmission } from "@/components/layouts/PersonalProjectSubmission"

const Layout = ({ children }: PropsWithChildren) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:/60">
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
                {children}
            </div>
            <MilestoneSidebar className="col-span-2" />
        </div>
    )
}

export default Layout
