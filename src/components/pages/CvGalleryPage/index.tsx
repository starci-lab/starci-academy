"use client"

import React, {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { CvGallery } from "./CvGallery"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { Container } from "@/components/frames/Container"
import { pathConfig } from "@/resources/path"

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

    const breadcrumbItems = useMemo(() => [
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
        <Container
            identity={{ tier: "page", component: "CvGalleryPage" }}
            size="xl"
            padding={6}
            principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
            body={() => (
                <CvGallery
                    breadcrumb={(
                        <ResponsiveBreadcrumb items={breadcrumbItems} />
                    )}
                />
            )}
        />
    )
}
