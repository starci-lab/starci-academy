"use client"

import React, { useMemo } from "react"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import type { MyFlashcardQuizSessionBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-session-by-session-id"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { MetricCard } from "@/components/blocks/stats/MetricCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyFlashcardQuizSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardQuizSessionBySessionIdSwr"
import { useQueryFlashcardCardsByIdsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFlashcardCardsByIdsSwr"
import { FlashcardQuizResultSkeleton } from "./FlashcardQuizResultSkeleton"
import { RecapEnrollUpsell, RecapReadinessCallout, RecapWeakTagsCard } from "./recapBlocks"

/**
 * The live end-of-run payload handed straight to {@link FlashcardQuizResult} on the
 * natural-completion path — the just-finished session assembled from local run state
 * + the `completeFlashcardQuizSession` response. When present, the by-id session query
 * is SKIPPED (no redundant re-fetch, no stale in-progress cache read) and the
 * query-absent `readiness` signal is shown. Absent → the URL-revisit path, which
 * fetches the persisted snapshot by id.
 */
export interface FlashcardQuizResultLiveExtras {
    /** The just-finished session snapshot (same shape the by-id query returns). */
    data: MyFlashcardQuizSessionBySessionIdData
    /** AI Mock Interview readiness — query-absent, live-only (hidden on URL revisit). */
    readiness: QuizSessionReadinessData | null
    /** Whether today's daily XP cap clamped the grant (transparency note). */
    dailyCapReached: boolean
}

/** Props for {@link FlashcardQuizResult}. */
export interface FlashcardQuizResultProps extends WithClassNames<undefined> {
    /** The finished "Hỏi nhanh" session to recap. */
    sessionId: string
    /** Owning course id (uuid) — enrollment-guard header + RAG search scope. */
    courseId: string
    /** Owning course slug — needed to build deep links from the study list. */
    courseDisplayId: string
    /** Returns to the flashcards overview (the single onward path — no dead end). */
    onBack: () => void
    /** Present on the LIVE end-of-run path — see {@link FlashcardQuizResultLiveExtras}. */
    live?: FlashcardQuizResultLiveExtras
}

/** Per-card outcome bucket — drives the status dot tone + aria label (never color-only). */
type PerCardStatus = "ok" | "partial" | "none"

/** Classify a card's cloze breakdown into a status bucket. */
const classify = (correctBlanks: number, totalBlanks: number): PerCardStatus => {
    if (totalBlanks > 0 && correctBlanks >= totalBlanks) {
        return "ok"
    }
    return correctBlanks > 0 ? "partial" : "none"
}

/** Status-dot tone per bucket (paired with a text n/m chip so color is never the only signal). */
const STATUS_DOT: Record<PerCardStatus, string> = {
    ok: "bg-success",
    partial: "bg-warning",
    none: "bg-danger",
}

/**
 * The URL-addressable RESULT surface for a finished "Hỏi nhanh" (quick-quiz) run —
 * the completion screen AND the render for revisiting a finished session by URL.
 * Mirrors {@link import("../FlashcardSessionStats").FlashcardSessionStats}'s shell:
 * a centered `max-w-3xl` column of canonical blocks — HERO = three metric tiles
 * (coverage · XP · fully-correct), the persisted-but-previously-unrendered per-card
 * cloze breakdown (card text re-fetched by id, overlaid with each card's blank
 * score), the most-forgotten tags, and a self-hiding RAG "study this" list keyed off
 * those tags. All numbers are read straight off the persisted snapshot (authoritative,
 * never client re-computed). A not-found / degraded session falls back to a bare
 * onward CTA — never an error, never a dead end.
 *
 * @param props - {@link FlashcardQuizResultProps}
 */
export const FlashcardQuizResult = ({
    sessionId,
    courseId,
    courseDisplayId,
    onBack,
    live,
    className,
}: FlashcardQuizResultProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // trial vs enrolled — gates the enroll upsell (trial) + the AI Mock Interview
    // readiness cross-link (enrolled). Populated globally by `learn/layout.tsx`.
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)

    // live path hands the data in directly (no fetch); revisit path resolves by id.
    const sessionSwr = useQueryMyFlashcardQuizSessionBySessionIdSwr(live ? undefined : sessionId, courseId)
    const data = live?.data ?? sessionSwr.data

    // per-card breakdown needs the card TEXT — the persisted `results` carry only
    // blank counts by id, so re-hydrate the text (both paths, one code path).
    const resultCardIds = useMemo(() => (data?.results ?? []).map((result) => result.cardId), [data])
    const cardsSwr = useQueryFlashcardCardsByIdsSwr(resultCardIds, courseId)
    const cardById = useMemo(
        () => new Map((cardsSwr.data ?? []).map((card) => [card.cardId, card])),
        [cardsSwr.data],
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <PageHeader
                className="mx-auto w-full max-w-3xl"
                breadcrumb={<BackLink label={t("flashcard.title")} onPress={onBack} />}
                title={t("flashcard.quiz.result.title")}
                description={t("flashcard.quiz.result.subtitle")}
            />

            <AsyncContent
                isLoading={!live && sessionSwr.isLoading && !sessionSwr.data}
                skeleton={<FlashcardQuizResultSkeleton />}
                error={!data ? sessionSwr.error : undefined}
                errorContent={{
                    title: t("flashcard.quiz.result.fallback"),
                    onRetry: () => { void sessionSwr.mutate() },
                    retryLabel: t("flashcard.quiz.result.backToReview"),
                }}
            >
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    {(() => {
                        // not found / not owned — a bare, honest fallback with the onward path.
                        if (!data) {
                            return (
                                <EmptyState
                                    icon={<CheckCircleIcon aria-hidden focusable="false" />}
                                    title={t("flashcard.quiz.result.fallback")}
                                    action={(
                                        <Button size="sm" variant="primary" onPress={onBack}>
                                            {t("flashcard.quiz.result.backToReview")}
                                        </Button>
                                    )}
                                />
                            )
                        }

                        const learn = pathConfig().locale(locale).course(courseDisplayId).learn()
                        const genericContinueHref = learn.module().build()
                        const topWeakTags = data.weakTags.slice(0, 3)
                        const overflowWeakTags = data.weakTags.slice(3)
                        // resolve a weak tag straight to its lesson when the deck→lesson mapping was
                        // unambiguous; `null` → the caller falls back to `genericContinueHref`.
                        const resolveTagHref = (tag: QuizSessionWeakTagData) =>
                            tag.moduleId && tag.contentId
                                ? learn.module(tag.moduleId).content(tag.contentId).build()
                                : tag.moduleId
                                    ? learn.module(tag.moduleId).build()
                                    : null

                        return (
                            <>
                                {/* HERO — three authoritative metric tiles (outcome first). */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <MetricCard
                                        value={data.coverage != null ? `${Math.round(data.coverage * 100)}%` : "—"}
                                        label={t("flashcard.quiz.result.coverageLabel")}
                                    />
                                    <MetricCard
                                        value={(
                                            <span className={cn(data.xpEarned === 0 && "text-muted")}>
                                                {`+${data.xpEarned}`}
                                            </span>
                                        )}
                                        label={t("flashcard.quiz.result.xpLabel")}
                                    />
                                    <MetricCard
                                        value={`${data.fullyCorrectCount}/${data.cardCount}`}
                                        label={t("flashcard.quiz.result.fullyCorrectLabel")}
                                    />
                                </div>

                                {live?.dailyCapReached ? (
                                    <Typography type="body-xs" color="muted">
                                        {t("flashcard.quiz.dailyCapReached")}
                                    </Typography>
                                ) : null}

                                {/* PER-CARD breakdown — the persisted-but-unrendered `results` jsonb,
                                    card text re-fetched by id + overlaid with each blank score. Its
                                    OWN AsyncContent (a second fetch). Hidden when nothing was answered. */}
                                {data.results.length > 0 ? (
                                    <LabeledCard label={t("flashcard.quiz.result.perCardHeading")} frameless>
                                        <AsyncContent
                                            isLoading={cardsSwr.isLoading && !cardsSwr.data}
                                            skeleton={(
                                                <div className="flex flex-col gap-2">
                                                    {Array.from({ length: Math.min(data.results.length, 5) }).map((_, index) => (
                                                        <div key={index} className="h-12 w-full animate-pulse rounded-xl bg-default" />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            <SurfaceListCard>
                                                {data.results.map((result, index) => {
                                                    const status = classify(result.correctBlanks, result.totalBlanks)
                                                    const card = cardById.get(result.cardId)
                                                    return (
                                                        <SurfaceListCardItem key={`${result.cardId}-${index}`}>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex min-w-0 items-center gap-2.5">
                                                                    <span
                                                                        className={cn("size-2.5 shrink-0 rounded-full", STATUS_DOT[status])}
                                                                        role="img"
                                                                        aria-label={t(`flashcard.quiz.result.cardStatus.${status}`)}
                                                                    />
                                                                    <Typography type="body-sm" className="min-w-0 truncate">
                                                                        {card?.front ?? t("flashcard.quiz.result.cardFallback", { index: index + 1 })}
                                                                    </Typography>
                                                                </div>
                                                                <Chip
                                                                    size="sm"
                                                                    variant="soft"
                                                                    color={status === "ok" ? "success" : status === "partial" ? "warning" : "danger"}
                                                                    className="shrink-0 tabular-nums"
                                                                >
                                                                    {t("flashcard.quiz.result.cardScore", {
                                                                        correct: result.correctBlanks,
                                                                        total: result.totalBlanks,
                                                                    })}
                                                                </Chip>
                                                            </div>
                                                        </SurfaceListCardItem>
                                                    )
                                                })}
                                            </SurfaceListCard>
                                        </AsyncContent>
                                    </LabeledCard>
                                ) : null}

                                {/* enroll upsell (trial only) — the result's PRIMARY action for a
                                    trial viewer, framed as a reward for the momentum just built. */}
                                {enrollKnown && !enrolled ? <RecapEnrollUpsell /> : null}

                                {/* weak-tags demand-bridge: PRIMARY when enrolled, a smaller secondary
                                    link under the upsell when trial. */}
                                <RecapWeakTagsCard
                                    weakTags={topWeakTags}
                                    overflowWeakTags={overflowWeakTags}
                                    resolveTagHref={resolveTagHref}
                                    genericHref={genericContinueHref}
                                    primary={enrollKnown && enrolled}
                                />

                                {/* quiet, self-hiding "study this too" — RAG search keyed off the
                                    same weak tags (no typing); auto-hides when there are none. */}
                                {topWeakTags.length > 0 ? (
                                    <RelatedContentList
                                        courseId={courseId}
                                        courseDisplayId={courseDisplayId}
                                        query={topWeakTags.map((tag) => tag.tag).join(" ")}
                                        label={t("flashcard.quiz.result.studyHeading")}
                                    />
                                ) : null}

                                {/* AI Mock Interview readiness — live-only (query-absent), enrolled-only. */}
                                {enrollKnown && enrolled && live?.readiness ? (
                                    <RecapReadinessCallout
                                        readiness={live.readiness}
                                        mockInterviewHref={learn.mockInterview().build()}
                                    />
                                ) : null}

                                {/* onward path — never a dead end, even with no weak tags. */}
                                <div className="flex justify-center">
                                    <Button variant="tertiary" onPress={onBack}>
                                        {t("flashcard.quiz.result.backToReview")}
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
