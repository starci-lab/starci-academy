"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    _FoundationResourcePage,
    FoundationKind,
    type FoundationHeaderCrumb,
} from "./component"
import { useAppSelector } from "@/redux/hooks"
import { useQueryFoundationCategoriesSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationCategoriesSwr"
import { useQueryFoundationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationsSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { resolveFoundationMountFileUrl } from "@/components/features/learn/Foundations/utils"

/**
 * `FoundationResourcePage` — the CONNECTED half of the SRC TWIN. Mirrors the
 * data wiring already proven in `src/components/features/learn/Foundations/
 * FoundationResourceLayout` (v1: `FoundationResourceLayout`) onto the
 * storybook-driven block tree in `./component` instead of that v1's hand-built
 * layout — same route (`/foundations/[categoryId]/[foundationId]`, NOT swapped
 * here), same redux/SWR sources.
 *
 * Loads the category's resource list so a cold deep-link can resolve the
 * active resource by id (the id itself is URL-synced into redux elsewhere, by
 * the app-wide `UseEffects`), builds the same 6-crumb breadcrumb trail, and
 * derives the trial→enroll nudge off the same `state.user` fields
 * `TrialEnrollHook` reads.
 */
export const FoundationResourcePage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const foundation = useAppSelector((state) => state.foundation.entity)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const { open: openPayment } = usePaymentOverlayState()

    // load the category title + the resource list so the URL-synced entity resolves on a cold load
    useQueryFoundationCategoriesSwr()
    const { data: foundationsData, isLoading } = useQueryFoundationsSwr()

    /** First load: list still in flight and no resolved entity cached yet. */
    const isFirstLoad = (isLoading && !foundationsData) || !foundation

    /** Breadcrumb: home → courses → course → foundations hub → category → this resource. */
    const breadcrumbItems = useMemo((): Array<FoundationHeaderCrumb> => [
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
            key: "foundations-hub",
            label: t("foundations.title"),
            onPress: () => router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().foundations().build(),
            ),
        },
        {
            key: "category",
            label: category?.title || t("foundations.title"),
            onPress: () => router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().foundations(categoryId).build(),
            ),
        },
        {
            key: "foundation",
            label: foundation?.title || t("foundations.title"),
        },
    ], [
        category?.title,
        categoryId,
        course?.title,
        courseDisplayId,
        foundation?.title,
        locale,
        router,
        t,
    ])

    /** Topic tags, sorted the same way `FoundationMeta` sorts them. */
    const tags = useMemo(() => (foundation?.tags ?? [])
        .slice()
        .sort((left, right) => left.sortIndex - right.sortIndex)
        .map((tag) => ({ key: tag.id, label: tag.value })), [foundation?.tags])

    /** Resolved destination for `kind === ExternalLink`; empty/blank value → no button (matches `src`). */
    const linkUrl = useMemo(() => {
        if (foundation?.kind !== FoundationKind.ExternalLink || !foundation.value?.trim()) {
            return undefined
        }
        return resolveFoundationMountFileUrl(foundation.value)
    }, [foundation?.kind, foundation?.value])

    /** Same behaviour as `FoundationResourceBody` v1's own external-link button: open in a new tab. */
    const onOpenLink = useCallback((url: string) => {
        window.open(url, "_blank", "noopener,noreferrer")
    }, [])

    /** Open the shared enroll payment flow — same call `TrialEnrollHook` makes. */
    const onEnroll = useCallback(
        () => openPayment({ flow: PaymentFlow.CourseEnroll }),
        [openPayment],
    )

    return (
        <_FoundationResourcePage
            breadcrumbItems={breadcrumbItems}
            title={foundation?.title ?? ""}
            description={foundation?.description ?? undefined}
            kind={foundation?.kind ?? FoundationKind.Document}
            isRecommended={foundation?.isRecommended}
            tags={tags}
            author={foundation?.author ?? undefined}
            markdownBody={foundation?.kind === FoundationKind.Document ? foundation.value ?? undefined : undefined}
            linkTitle={foundation?.kind === FoundationKind.ExternalLink ? foundation.title : undefined}
            linkUrl={linkUrl}
            onOpenLink={onOpenLink}
            isEnrollmentKnown={enrollKnown}
            isEnrolled={enrolled}
            onEnroll={onEnroll}
            isEmpty={!isFirstLoad && !foundation}
            isSkeleton={isFirstLoad}
        />
    )
}
