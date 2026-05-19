"use client"

import { Breadcrumbs, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import {
    useQueryHeadhunterCompaniesSwr,
    useQueryHeadhuntersSwr,
} from "@/hooks/singleton"
import { ConsultantCard } from "./ConsultantCard"
import { ConsultantCardSkeleton } from "./ConsultantCardSkeleton"

/** One breadcrumb row for the learn headhuntings page. */
type HeadhuntingsLearnBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler. */
    onPress?: () => void
}

/**
 * Learn headhuntings page: grid of consultant cards; card opens profile modal.
 */
export const HeadhuntingsLearnLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const count = useAppSelector((state) => state.headhunter.count)

    useQueryHeadhunterCompaniesSwr()
    useQueryHeadhuntersSwr()

    const breadcrumbItems = useMemo((): Array<HeadhuntingsLearnBreadcrumbItem> => [
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
            key: "headhuntings",
            label: t("headhuntings.title"),
        },
    ], [
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    const sortedConsultants = useMemo(() => {
        if (!consultants?.length) {
            return []
        }
        return [...consultants].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [consultants])

    return (
        <div className="p-3">
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
            <div className="h-6" />
            <div>
                <div className="text-2xl font-bold">{t("headhuntings.title")}</div>
                <p className="text-muted mt-2 text-sm">{t("headhuntings.description")}</p>
            </div>
            <div className="h-6" />
            {!consultants ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("headhuntings.count", { count: count ?? 0 })}
                </p>
            )}
            <div className="h-6" />
            {!consultants ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ConsultantCardSkeleton key={index} />
                    ))}
                </div>
            ) : sortedConsultants.length === 0 ? (
                <p className="text-muted text-sm">{t("headhuntings.empty")}</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedConsultants.map((consultant) => (
                        <ConsultantCard
                            key={consultant.id}
                            consultant={consultant}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

