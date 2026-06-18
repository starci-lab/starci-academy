"use client"

import React from "react"
import {
    Button,
    Skeleton,
    cn,
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
} from "@/resources/path"
import {
    ResumeCard,
} from "./ResumeCard"
import {
    useResumeItems,
} from "./useResumeItems"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ContinueLearning}. */
export type ContinueLearningProps = WithClassNames<undefined>

/**
 * "Tiếp tục học" content — the single most important next-action slot: a capped
 * set of resume cards prioritising in-progress challenges (active work) over
 * recently-read lessons. When the viewer has joined no course it shows an
 * onboarding CTA instead of an empty void. Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it; the greeting lives
 * in the identity column). Self-fetches its own leaf queries (no data props).
 * @param props - optional className for the root element.
 */
export const ContinueLearning = ({
    className,
}: ContinueLearningProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        resumeItems,
        hasCourses,
        isLoading,
    } = useResumeItems()

    // first load — keep the height stable so the card never jumps
    if (isLoading) {
        return (
            <div className={cn("flex flex-col gap-3", className)}>
                <Skeleton className="h-16 w-full rounded-large" />
                <Skeleton className="h-16 w-full rounded-large" />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* resume cards, or an onboarding CTA when there is nothing to resume */}
            {resumeItems.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {resumeItems.map((item) => (
                        <ResumeCard
                            key={item.globalId}
                            item={item}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-start gap-3 rounded-large border p-3">
                    <span className="text-sm text-muted">
                        {hasCourses
                            ? t("dashboard.continueResumeEmpty")
                            : t("dashboard.emptyCourses")}
                    </span>
                    <Button
                        variant="primary"
                        onPress={() => router.push(pathConfig().locale(locale).course().build())}
                    >
                        {t("dashboard.browseCourses")}
                    </Button>
                </div>
            )}
        </div>
    )
}
