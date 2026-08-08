"use client"

import React, {
    useCallback,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import {
    useResumeItems,
} from "@/hooks/useResumeItems"
import { _ContinueLearning } from "./component"

/**
 * "Continue learning" content — the CONNECTED half (see `tiers/split.md`): self-fetches
 * its leaf queries via {@link useResumeItems}, resolves every label, and hands them to
 * the presentational {@link _ContinueLearning}. Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it; the greeting lives
 * in the identity column). Takes no props — self-contained, no escape hatch (BLOCK-4).
 */
export const ContinueLearning = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        resumeItems,
        hasCourses,
        isLoading,
    } = useResumeItems()

    /** Onboarding CTA — jumps to the course catalog. */
    const onBrowseCourses = useCallback(
        () => router.push(pathConfig().locale(locale).course().build()),
        [router, locale],
    )

    return (
        <_ContinueLearning
            isSkeleton={isLoading}
            resumeItems={resumeItems}
            hasCourses={hasCourses}
            onBrowseCourses={onBrowseCourses}
            labels={{
                resumeEmpty: t("DashboardPage.continueResumeEmpty"),
                coursesEmpty: t("DashboardPage.emptyCourses"),
                browseCourses: t("DashboardPage.browseCourses"),
            }}
        />
    )
}
