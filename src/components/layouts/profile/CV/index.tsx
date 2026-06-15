"use client"

import React, {
    useMemo,
} from "react"
import {
    Breadcrumbs,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
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
import {
    useQueryCvUrlSwr,
} from "@/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { cn } from "@heroui/react"
import { CVUpload } from "./CVUpload"
import { CVPreview } from "./CVPreview"

/** One breadcrumb row for the learn CV page. */
type CvLearnBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label (already translated or course title). */
    label: string
    /** Optional navigation handler when the segment is clickable. */
    onPress?: () => void
}

/** Props for {@link CvLearnLayout}. */
export type CvLearnLayoutProps = WithClassNames<undefined>

/**
 * Learn-module CV page: breadcrumbs, CV upload block, feedback summary, and PDF preview.
 * @param props - {@link CvLearnLayoutProps}
 */
export const CvLearnLayout = ({ className }: CvLearnLayoutProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    useQueryCvUrlSwr()

    const breadcrumbItems = useMemo((): Array<CvLearnBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "cv",
            label: t("course.cvTitle"),
        },
    ], [
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    return (
        <div className={cn("grid grid-cols-1 items-start lg:grid-cols-5", className)}>
            <div className="col-span-3 min-w-0 lg:border-r lg:border-divider/60">
                <div className="p-3 pb-0">
                    <Breadcrumbs>
                        {breadcrumbItems.map((item) => (
                            <Breadcrumbs.Item
                                key={item.key}
                                onPress={item.onPress}
                            >
                                {item.label}
                            </Breadcrumbs.Item>
                        ))}
                    </Breadcrumbs>
                </div>
                <div className="h-3" />
                <div className="p-3">
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="text-2xl font-bold">{t("course.cvTitle")}</div>
                            <div className="text-muted mt-2 text-sm">{t("course.cvDescription")}</div>
                        </div>
                        <CVUpload />
                    </div>
                </div>
            </div>
            <CVPreview />
        </div>
    )
}
