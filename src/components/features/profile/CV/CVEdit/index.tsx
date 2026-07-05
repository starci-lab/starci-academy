"use client"

import React, { useMemo } from "react"
import {
    Breadcrumbs,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CVUpload } from "../CVUpload"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { pathConfig } from "@/resources/path"

/** One breadcrumb row for the CV edit page. */
type CvEditBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler when the segment is clickable. */
    onPress?: () => void
}

/** Props for {@link CVEdit}. */
export type CVEditProps = WithClassNames<undefined>

/**
 * `/profile/cv/edit` — the CV **configuration** page: upload a PDF/text file or
 * have AI generate/revise one from the learner's StarCi activity, optionally
 * tied to a course/track. Split out from the review page (`/profile/cv`,
 * {@link Cv}) so uploading/generating — a deliberate, occasional action — gets
 * its own focused page instead of sharing space with the score/feedback/preview
 * the learner reviews on every visit. Once a run finishes, {@link CVUpload}
 * navigates back to `/profile/cv` to show the fresh result.
 *
 * @param props - {@link CVEditProps}
 */
export const CVEdit = ({ className }: CVEditProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const breadcrumbItems = useMemo((): Array<CvEditBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "profile",
            label: t("nav.profile"),
            onPress: () => router.push(pathConfig().locale(locale).profile().build()),
        },
        {
            key: "cv",
            label: t("cv.title"),
            onPress: () => router.push(pathConfig().locale(locale).profile().cv().build()),
        },
        {
            key: "edit",
            label: t("cv.editTitle"),
        },
    ], [
        locale,
        router,
        t,
    ])

    return (
        <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-6", className)}>
            <PageHeader
                breadcrumb={(
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
                )}
                title={t("cv.editTitle")}
                description={t("cv.editDescription")}
            />
            <CVUpload />
        </div>
    )
}
