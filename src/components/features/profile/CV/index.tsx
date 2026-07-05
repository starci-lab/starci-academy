"use client"

import React, {
    useMemo,
} from "react"
import {
    Breadcrumbs,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CvWorkspace } from "./CvWorkspace"
import { pathConfig } from "@/resources/path"

/** One breadcrumb row for the CV page. */
type CvBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler when the segment is clickable. */
    onPress?: () => void
}

/** Props for {@link Cv}. */
export type CvProps = WithClassNames<undefined>

/**
 * CV page — a USER-level (not course-scoped) résumé tool: upload + AI feedback + PDF preview.
 * Hosted at `/profile/cv` (the user owns one CV across all courses). Profile-context breadcrumb
 * (Home › Hồ sơ › CV) wrapping the shared {@link CvWorkspace} (also rendered, without a
 * breadcrumb, as the public-profile "CV" tab).
 *
 * @param props - {@link CvProps}
 */
export const Cv = ({ className }: CvProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const breadcrumbItems = useMemo((): Array<CvBreadcrumbItem> => [
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
        },
    ], [
        locale,
        router,
        t,
    ])

    return (
        <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col px-6 py-6", className)}>
            <CvWorkspace
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
            />
        </div>
    )
}
