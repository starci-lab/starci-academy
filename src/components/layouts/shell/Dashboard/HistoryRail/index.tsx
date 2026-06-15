"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Button,
    ProgressBar,
    Skeleton,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyCoursesSwr,
    useQueryMyInProgressChallengesSwr,
    useQueryMyLearnedLessonsSwr,
    useQueryMyWeeklyStatsSwr,
} from "@/hooks"
import {
    SearchInput,
} from "@/components/reuseable"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import type {
    QueryMyDashboardRefItemData,
} from "@/modules/api"
import {
    EntityToken,
} from "../EntityToken"

/** One titled, searchable section of left-rail items. */
interface RailSection {
    /** i18n key suffix under `dashboard.*` for the section heading + empty text. */
    key: string
    /** Items to render in this section. */
    items: Array<QueryMyDashboardRefItemData>
}

/**
 * GitHub-style left rail: the viewer's identity on top, then the "my courses"
 * list (with milestone bars), a "this week" stats widget, and searchable history
 * sections (recent lessons, in-progress challenges). Each rail block **fetches
 * its own leaf query** (no prop-drill) — courses / learned lessons / in-progress
 * challenges / weekly stats — and the rail owns its loading + error states.
 * `"use client"` for redux + the search filter + SWR.
 */
export const HistoryRail = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const user = useAppSelector((state) => state.user.user)

    // each rail block reads its own leaf query directly (component-owned state)
    const courses = useQueryMyCoursesSwr()
    const learnedLessons = useQueryMyLearnedLessonsSwr()
    const inProgressChallenges = useQueryMyInProgressChallengesSwr()
    const weeklyStats = useQueryMyWeeklyStatsSwr()

    /** Immediate filter input (filters every section by label). */
    const [query, setQuery] = useState("")

    // first-load (no data yet) across any leaf → show the rail skeleton
    const isLoading = courses.isLoading
        || learnedLessons.isLoading
        || inProgressChallenges.isLoading
        || weeklyStats.isLoading
    // any leaf failed (often a dead session behind a stale cookie)
    const hasError = Boolean(courses.error
        || learnedLessons.error
        || inProgressChallenges.error
        || weeklyStats.error)

    /**
     * Display name shown next to the avatar. Prefers the user's chosen display
     * name; otherwise derives a readable handle from the email/username by taking
     * the part before "@" (so we never surface a raw email by default).
     */
    const displayName = useMemo(
        () => {
            const explicit = user?.displayName?.trim()
            if (explicit) {
                return explicit
            }
            const base = user?.email ?? user?.username ?? ""
            return base.split("@")[0]
        },
        [
            user,
        ],
    )

    /** Sections filtered by the label query (case-insensitive). */
    const sections = useMemo<Array<RailSection>>(
        () => {
            const needle = query.trim().toLowerCase()
            const apply = (items: Array<QueryMyDashboardRefItemData>) => (
                needle
                    ? items.filter((item) => item.label.toLowerCase().includes(needle))
                    : items
            )
            return [
                {
                    key: "recentContent",
                    items: apply(learnedLessons.data ?? []),
                },
                {
                    key: "inProgressChallenges",
                    items: apply(inProgressChallenges.data ?? []),
                },
            ]
        },
        [
            query,
            learnedLessons.data,
            inProgressChallenges.data,
        ],
    )

    /** Course (milestone) rows filtered by the same label query. */
    const filteredCourses = useMemo(
        () => {
            const needle = query.trim().toLowerCase()
            const rows = courses.data ?? []
            return needle
                ? rows.filter((item) => item.label.toLowerCase().includes(needle))
                : rows
        },
        [
            query,
            courses.data,
        ],
    )

    /** Weekly stats with safe defaults so the widget always renders. */
    const stats = weeklyStats.data ?? {
        streak: 0,
        xp: 0,
        lessons: 0,
    }

    // first load — placeholder rail so the column never jumps
    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-medium" />
                </div>
                <Skeleton className="h-9 w-full rounded-medium" />
                <div className="flex flex-col gap-2">
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-4 w-full rounded-medium"
                        />
                    ))}
                </div>
            </div>
        )
    }

    // a failed leaf (often a dead session) — never hang; offer retry + a way home
    if (hasError) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-3xl p-3 text-center">
                <div className="text-sm text-muted">
                    {t("dashboard.loadError")}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Button
                        variant="tertiary"
                        onPress={() => {
                            // re-run every rail leaf
                            void courses.mutate()
                            void learnedLessons.mutate()
                            void inProgressChallenges.mutate()
                            void weeklyStats.mutate()
                        }}
                    >
                        {t("dashboard.retry")}
                    </Button>
                    <Button
                        variant="primary"
                        onPress={() => router.push(`/${locale}/home`)}
                    >
                        {t("dashboard.goHome")}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-3">
            {/* identity block (avatar + display name) */}
            <div className="flex items-center gap-3">
                <UserAvatar
                    className="size-10"
                    username={displayName}
                    avatar={user?.avatar}
                    seed={user?.email ?? user?.username ?? displayName}
                />
                <div>
                    <div className="text-sm font-semibold text-foreground">
                        {displayName}
                    </div>
                    <div className="text-xs text-muted">
                        {user?.username}
                    </div>
                </div>
            </div>

            <SearchInput
                value={query}
                onValueChange={setQuery}
                placeholder={t("dashboard.historySearch")}
                className="sm:max-w-none"
            />

            {/* "my courses": every joined course as a token + a completed/total
                milestone bar (the milestone list doubles as the course list, so a
                0/0 course still shows — just without a bar) */}
            <div className="flex flex-col gap-3">
                <div className="text-base font-semibold text-foreground">
                    {t("dashboard.enrolledCourses")}
                </div>
                {filteredCourses.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredCourses.map((item) => {
                            // three progress dimensions per course; render a row only
                            // when that dimension exists (total > 0) so a course with
                            // no challenges/milestones doesn't show a "0/0" line
                            const metrics = [
                                {
                                    key: "content",
                                    completed: item.contentCompleted,
                                    total: item.contentTotal,
                                },
                                {
                                    key: "challenge",
                                    completed: item.challengeCompleted,
                                    total: item.challengeTotal,
                                },
                                {
                                    key: "milestone",
                                    completed: item.completed,
                                    total: item.total,
                                },
                            ]
                            return (
                                <div
                                    key={item.globalId}
                                    className="flex flex-col gap-2"
                                >
                                    <EntityToken
                                        globalId={item.globalId}
                                        label={item.label}
                                    />
                                    {metrics
                                        .filter((metric) => metric.total > 0)
                                        .map((metric) => (
                                            <div
                                                key={metric.key}
                                                className="flex flex-col gap-1"
                                            >
                                                <div className="flex items-center justify-between gap-2 text-xs text-muted">
                                                    <span>
                                                        {t(`dashboard.courseProgress.${metric.key}`)}
                                                    </span>
                                                    <span className="shrink-0">
                                                        {metric.completed}/{metric.total}
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    aria-label={`${item.label} ${metric.key}`}
                                                    value={metric.completed}
                                                    maxValue={metric.total}
                                                    color="accent"
                                                    size="sm"
                                                >
                                                    <ProgressBar.Track>
                                                        <ProgressBar.Fill />
                                                    </ProgressBar.Track>
                                                </ProgressBar>
                                            </div>
                                        ))}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-muted">
                        {t("dashboard.enrolledCoursesEmpty")}
                    </div>
                )}
            </div>

            {/* "this week": rolling 7-day activity — streak / XP / lessons read */}
            <div className="flex flex-col gap-3">
                <div className="text-base font-semibold text-foreground">
                    {t("dashboard.weekStats")}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {/* streak — flame glyph reinforces the consecutive-day count */}
                    <div className="flex flex-col items-center gap-0.5 rounded-medium bg-default/40 p-3">
                        <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                            <svg
                                viewBox="0 0 24 24"
                                className="size-4 text-warning"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 2c.5 3-1.5 4.5-3 6-1.6 1.6-3 3.3-3 6a6 6 0 0 0 12 0c0-2-1-3.7-2-5-.3 1.2-1 2-2 2 .8-2.2.3-4.6-2-9z" />
                            </svg>
                            {stats.streak}
                        </div>
                        <div className="text-xs text-muted">
                            {t("dashboard.streakLabel")}
                        </div>
                    </div>
                    {/* XP earned in the window */}
                    <div className="flex flex-col items-center gap-0.5 rounded-medium bg-default/40 p-3">
                        <div className="text-lg font-semibold text-foreground">
                            {stats.xp}
                        </div>
                        <div className="text-xs text-muted">
                            {t("dashboard.xpLabel")}
                        </div>
                    </div>
                    {/* lessons read in the window */}
                    <div className="flex flex-col items-center gap-0.5 rounded-medium bg-default/40 p-3">
                        <div className="text-lg font-semibold text-foreground">
                            {stats.lessons}
                        </div>
                        <div className="text-xs text-muted">
                            {t("dashboard.lessonsLabel")}
                        </div>
                    </div>
                </div>
            </div>

            {/* one block per section: heading + token rows (or empty hint) */}
            {sections.map((section) => (
                <div
                    key={section.key}
                    className="flex flex-col gap-3"
                >
                    <div className="text-base font-semibold text-foreground">
                        {t(`dashboard.${section.key}`)}
                    </div>
                    {section.items.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            {section.items.map((item) => (
                                <EntityToken
                                    key={item.globalId}
                                    globalId={item.globalId}
                                    label={item.label}
                                    block
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted">
                            {t(`dashboard.${section.key}Empty`)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
