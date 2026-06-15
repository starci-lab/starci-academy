"use client"

import React from "react"
import {
    cn,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useQueryUserCodingHistorySwr,
    useQueryUserCodingProgressSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    useProfileUsername,
} from "../useProfileUsername"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileCoding}. */
export type ProfileCodingProps = WithClassNames<undefined>

/** Tailwind text colour per difficulty value (easy → hard). */
const DIFFICULTY_CLASS: Record<string, string> = {
    easy: "text-success",
    medium: "text-warning",
    hard: "text-danger",
}

/**
 * Coding tab of the public profile — coding-practice stats (solved / attempted /
 * points) plus the solved-problem history with the language(s) used. Self-contained
 * container: reads the username from the route, resolves it to the entity id, and
 * drives its own SWR (both reads are projection-backed server-side).
 *
 * @param props - optional className for the root element.
 */
export const ProfileCoding = ({
    className,
}: ProfileCodingProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // route carries the username; resolve to the entity id the queries key off
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserCodingProgressSwr(userId)
    const { data: history } = useQueryUserCodingHistorySwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // null data (no coding activity yet) → treat every metric as zero
    const stats = [
        {
            key: "solved",
            value: data?.solvedProblemIds.length ?? 0,
        },
        {
            key: "attempted",
            value: data?.attemptedProblemIds.length ?? 0,
        },
        {
            key: "points",
            value: data?.totalPoints ?? 0,
        },
    ]
    const solvedHistory = history ?? []

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* headline stat cards */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className="flex flex-col gap-0 rounded-large border border-default/40 p-4"
                    >
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted">{t(`publicProfile.coding.${stat.key}`)}</span>
                    </div>
                ))}
            </div>

            {/* solved-problem history with the language(s) used */}
            {solvedHistory.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-foreground">
                        {t("publicProfile.coding.history")}
                    </div>
                    <div className="flex flex-col">
                        {solvedHistory.map((item, index) => (
                            <div
                                key={`${item.problemTitle}-${index}`}
                                className="flex items-center justify-between gap-3 border-b border-default/40 py-3 last:border-b-0"
                            >
                                <div className="flex min-w-0 flex-col gap-0">
                                    <span className="truncate text-sm text-foreground">{item.problemTitle}</span>
                                    <span className="flex items-center gap-1.5 text-xs">
                                        <span className={cn("font-medium", DIFFICULTY_CLASS[item.difficulty] ?? "text-muted")}>
                                            {item.difficulty}
                                        </span>
                                        {item.firstSolvedAt ? (
                                            <span className="text-muted">
                                                · {new Date(item.firstSolvedAt).toLocaleDateString(locale)}
                                            </span>
                                        ) : null}
                                    </span>
                                </div>
                                {/* language flex — chips of every language the problem was solved in */}
                                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                                    {item.languages.map((language) => (
                                        <span
                                            key={language}
                                            className="rounded-medium bg-default/40 px-1.5 py-0.5 text-[11px] text-foreground"
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
