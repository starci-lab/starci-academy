"use client"

import React, { useMemo } from "react"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { MetricCard } from "@/components/blocks/stats/MetricCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { FlashcardSessionStatsSkeleton } from "./FlashcardSessionStatsSkeleton"
import { useQueryMyFlashcardReviewSessionStatsBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionStatsBySessionIdSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"
import type { MyFlashcardReviewSessionStatsBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-review-session-stats-by-session-id"

/** Props for {@link FlashcardSessionStats}. */
export interface FlashcardSessionStatsProps extends WithClassNames<undefined> {
    /** The finished (or in-progress) review session to recap. */
    sessionId: string
    /** Owning course id (uuid) — enrollment-guard header + RAG search scope. */
    courseId: string
    /** Owning course slug — needed to build deep links from the study list. */
    courseDisplayId: string
    /** Returns to the flashcards study overview (the single onward path — no dead end). */
    onBack: () => void
}

/**
 * One SM-2 grade bucket in the hero distribution: its data key, i18n label key,
 * and the semantic bar tone (a low-recall grade must READ low). `good`/`easy`
 * both share the success tone — the meter primitive carries four tones and the
 * ordering already separates them.
 */
const GRADE_ROWS: ReadonlyArray<{
    key: keyof MyFlashcardReviewSessionStatsBySessionIdData["gradeCounts"]
    labelKey: string
    color: "accent" | "success" | "warning" | "danger"
}> = [
    { key: "again", labelKey: "flashcard.review.again", color: "danger" },
    { key: "hard", labelKey: "flashcard.review.hard", color: "warning" },
    { key: "good", labelKey: "flashcard.review.good", color: "success" },
    { key: "easy", labelKey: "flashcard.review.easy", color: "success" },
]

/**
 * The end-of-session STATS surface for a "Học thẻ" review run (deck-review or
 * cross-deck due-review) — the completion screen (replaces the old flat "done"
 * card) AND the render for revisiting a finished session by URL. Mirrors
 * `MockInterviewScorecard`'s shell: a centered `max-w-3xl` column of canonical
 * blocks — HERO = the 4-grade SM-2 distribution (NOT a binary remembered/forgot
 * ring), then session metric tiles, the most-forgotten tags, and a self-hiding
 * RAG "study this" list keyed off those weak tags (the payoff loop back into the
 * course). Numbers are 100% real events, XP shown honestly (a due-review of
 * already-seen cards earns 0). A legacy/degraded session (no per-grade data)
 * falls back to a count-only recap — never an error.
 *
 * @param props - {@link FlashcardSessionStatsProps}
 */
export const FlashcardSessionStats = ({
    sessionId,
    courseId,
    courseDisplayId,
    onBack,
    className,
}: FlashcardSessionStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const statsSwr = useQueryMyFlashcardReviewSessionStatsBySessionIdSwr(sessionId, courseId)
    const stats = statsSwr.data
    // which kind of run this was (single deck vs cross-deck "Đến hạn") + the deck
    // identity when applicable — resolved purely from the sessionId (thầy
    // 2026-07-13: "render lại kết quả phiên ôn gì, due hay deck"), same query the
    // LIVE session already uses to pick its chrome.
    const sessionContextSwr = useQueryMyFlashcardReviewSessionBySessionIdSwr(sessionId, courseId)
    const sessionContext = sessionContextSwr.data

    // next-due date — short "DD Mon" per locale; null when nothing scheduled.
    const dueDateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }),
        [locale],
    )

    // seconds → a compact localized duration ("45 giây" / "6 phút"); em-dash when unknown.
    const formatDuration = (seconds: number | null): string => {
        if (seconds === null || seconds <= 0) {
            return "—"
        }
        return seconds < 60
            ? t("flashcard.review.stats.durationSeconds", { count: seconds })
            : t("flashcard.review.stats.durationMinutes", { count: Math.round(seconds / 60) })
    }

    // weak-tag terms drive the RAG "study this" query — the learner types nothing.
    const relatedQuery = (stats?.weakTags ?? []).map((weak) => weak.tag).join(" ")

    // which run this was, folded straight into the TITLE text (not a separate
    // chip — thầy 2026-07-13: "kiểu label ấy, bỏ chip, ví dụ là ghi là kết quả
    // phiên ôn due") — falls back to the generic caption while resolving/absent
    // (legacy session with no matching row).
    const headerCaption = !sessionContext
        ? t("flashcard.review.stats.headerCaption")
        : sessionContext.kind === "due"
            ? t("flashcard.review.stats.headerCaptionDue")
            : sessionContext.deckTitle
                ? t("flashcard.review.stats.headerCaptionDeck", { deckTitle: sessionContext.deckTitle })
                : t("flashcard.review.stats.headerCaption")

    return (
        // reached via the "Học thẻ"/"Ôn thẻ đến hạn" LIVE session route
        // (`review/sessions/[sessionId]`), `fullBleed` for the whole session
        // including this recap phase — same gap as `FlashcardQuizResult`
        // (2026-07-12, thầy: "thiếu padding p-6"). Owns its own page padding.
        <div className={cn("flex flex-col gap-6 px-4 py-6 sm:px-6", className)}>
            <PageHeader
                className="mx-auto w-full max-w-3xl"
                breadcrumb={<BackLink label={t("flashcard.title")} onPress={onBack} />}
                title={headerCaption}
                description={t("flashcard.review.stats.heroSubtitle")}
            />

            <AsyncContent
                isLoading={statsSwr.isLoading && !stats}
                skeleton={<FlashcardSessionStatsSkeleton />}
                error={!stats ? statsSwr.error : undefined}
                errorContent={{
                    title: t("flashcard.review.statsError"),
                    onRetry: () => { void statsSwr.mutate() },
                    retryLabel: t("flashcard.review.stats.retry"),
                }}
            >
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    {(() => {
                        // not found / not owned — a bare, honest fallback with the onward path.
                        if (!stats) {
                            return (
                                <EmptyState
                                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                                    title={t("flashcard.review.stats.fallbackTitle", { count: 0 })}
                                    description={t("flashcard.review.stats.fallbackNote")}
                                    action={(
                                        <Button size="sm" variant="primary" onPress={onBack}>
                                            {t("flashcard.review.stats.backToReview")}
                                        </Button>
                                    )}
                                />
                            )
                        }

                        const { again, hard, good, easy } = stats.gradeCounts
                        const gradeTotal = again + hard + good + easy
                        const solid = good + easy
                        const needsWork = again + hard

                        // degraded: legacy session (events predate the sessionId column) →
                        // no per-grade breakdown, so show a count-only recap, not an error.
                        if (gradeTotal === 0) {
                            return (
                                <EmptyState
                                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                                    title={t("flashcard.review.stats.fallbackTitle", { count: stats.reviewedCount })}
                                    description={t("flashcard.review.stats.fallbackNote")}
                                    action={(
                                        <Button size="sm" variant="primary" onPress={onBack}>
                                            {t("flashcard.review.stats.backToReview")}
                                        </Button>
                                    )}
                                />
                            )
                        }

                        return (
                            <>
                                {/* HERO — the 4-grade SM-2 distribution (outcome first). */}
                                <SectionCard contentClassName="flex flex-col gap-4">
                                    <div className="flex flex-col gap-3">
                                        {GRADE_ROWS.map((row) => {
                                            const count = stats.gradeCounts[row.key]
                                            const percent = Math.round((count / gradeTotal) * 100)
                                            return (
                                                <div key={row.key} className="flex items-center gap-3">
                                                    <Typography type="body-sm" className="w-16 shrink-0">
                                                        {t(row.labelKey)}
                                                    </Typography>
                                                    <ProgressMeter
                                                        value={count}
                                                        max={gradeTotal}
                                                        color={row.color}
                                                        className="flex-1"
                                                    />
                                                    <Typography
                                                        type="body-sm"
                                                        color="muted"
                                                        className="w-16 shrink-0 text-right"
                                                    >
                                                        {t("flashcard.review.stats.gradeCountPercent", { count, percent })}
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* subtle secondary rollup — never replaces the 4 grades above */}
                                    <Typography type="body-xs" color="muted">
                                        {t("flashcard.review.stats.rollup", { solid, needsWork })}
                                    </Typography>
                                </SectionCard>

                                {/* session metric tiles */}
                                <LabeledCard label={t("flashcard.review.stats.metricsLabel")} frameless>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <MetricCard
                                            value={stats.reviewedCount}
                                            label={t("flashcard.review.stats.metricTotal")}
                                        />
                                        <MetricCard
                                            value={formatDuration(stats.durationSeconds)}
                                            label={t("flashcard.review.stats.metricDuration")}
                                        />
                                        <MetricCard
                                            value={stats.nextDueAt
                                                ? dueDateFormatter.format(new Date(stats.nextDueAt))
                                                : "—"}
                                            label={t("flashcard.review.stats.metricNextDue")}
                                        />
                                        <MetricCard
                                            value={(
                                                <span className={cn(stats.xpEarned === 0 && "text-muted")}>
                                                    {t("flashcard.review.stats.xpValue", { count: stats.xpEarned })}
                                                </span>
                                            )}
                                            label={t("flashcard.review.stats.metricXp")}
                                        />
                                    </div>
                                </LabeledCard>

                                {/* most-forgotten tags — grouped from grade-0 cards */}
                                {stats.weakTags.length > 0 ? (
                                    <LabeledCard label={t("flashcard.review.stats.weakTagsHeading")} frameless>
                                        <SurfaceListCard>
                                            {stats.weakTags.map((weak) => (
                                                <SurfaceListCardItem key={weak.tag}>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <WarningCircleIcon
                                                                aria-hidden
                                                                focusable="false"
                                                                className="size-4 shrink-0 text-warning-soft-foreground"
                                                            />
                                                            <Typography type="body-sm" className="min-w-0 truncate">
                                                                {weak.tag}
                                                            </Typography>
                                                        </div>
                                                        <Chip size="sm" variant="soft" color="danger" className="shrink-0">
                                                            {t("flashcard.review.stats.forgotCount", { count: weak.forgotCount })}
                                                        </Chip>
                                                    </div>
                                                </SurfaceListCardItem>
                                            ))}
                                        </SurfaceListCard>
                                    </LabeledCard>
                                ) : null}

                                {/* PRIMARY payoff — self-hiding RAG "study your weak spot" list,
                                    keyed off the weak tags (auto-hides when there are none). */}
                                <RelatedContentList
                                    courseId={courseId}
                                    courseDisplayId={courseDisplayId}
                                    query={relatedQuery}
                                    label={t("flashcard.review.stats.studyHeading")}
                                />

                                {/* onward path — never a dead end, even with no weak tags */}
                                <div className="flex justify-center">
                                    <Button variant="tertiary" onPress={onBack}>
                                        {t("flashcard.review.stats.backToReview")}
                                    </Button>
                                </div>
                            </>
                        )
                    })()}
                </div>
            </AsyncContent>
        </div>
    )
}
