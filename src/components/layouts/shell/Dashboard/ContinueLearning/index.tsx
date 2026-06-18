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
 * Dashboard hero — "pick up where you left off". The single most important slot:
 * it turns the dashboard from a wall of stats into a clear next action. Leads with
 * a greeting, then a capped set of resume cards prioritising in-progress
 * challenges (active work) over recently-read lessons. When the viewer has joined
 * no course it shows an onboarding CTA instead of an empty void. Self-fetches its
 * own leaf queries (no data props). `"use client"` for redux + SWR + navigation.
 * @param props - optional className for the root element.
 */
export const ContinueLearning = ({
    className,
}: ContinueLearningProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        displayName,
        resumeItems,
        hasCourses,
        isLoading,
    } = useResumeItems()

    // first load — keep the hero height stable so the page never jumps
    if (isLoading) {
        return (
            <div className={cn("flex flex-col gap-3 p-3", className)}>
                <Skeleton className="h-5 w-48 rounded-medium" />
                <Skeleton className="h-16 w-full rounded-large" />
                <Skeleton className="h-16 w-full rounded-large" />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6 p-3", className)}>
            {/* greeting + subtitle */}
            <div className="flex flex-col gap-0">
                <span className="text-xl font-semibold text-foreground">
                    {t("dashboard.greeting", {
                        name: displayName,
                    })}
                </span>
                <span className="text-sm text-muted">
                    {t("dashboard.subtitle")}
                </span>
            </div>

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
