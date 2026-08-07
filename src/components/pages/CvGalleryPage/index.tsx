"use client"

import React, {
    useMemo,
} from "react"
import { Breadcrumbs } from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { CvGallery } from "./CvGallery"
import { pathConfig } from "@/resources/path"

/** One breadcrumb row for the CvGalleryPage page. */
type CvBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler when the segment is clickable. */
    onPress?: () => void
}

/** Props for {@link CvGalleryPage}. */
export type CvGalleryPageProps = Record<string, never>
/**
 * CvGalleryPage page — a USER-level (not course-scoped) resume tool. Hosted at
 * `/profile/cv` (the user owns many CVs across all courses). Profile-context
 * breadcrumb (Home › Profile › CvGalleryPage) wrapping the shared {@link CvBlocksWorkspace}
 * block editor (also rendered, without a breadcrumb, as the public-profile "CvGalleryPage"
 * tab).
 *
 * @param props - {@link CvGalleryPageProps}
 */
export const CvGalleryPage = () => {
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
        <div className={"mx-auto flex w-full max-w-[1280px] flex-col px-6 py-6"}>
            <CvGallery
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
