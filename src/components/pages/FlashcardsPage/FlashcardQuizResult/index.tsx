"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import type { MyFlashcardQuizSessionBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-session-by-session-id"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyFlashcardQuizSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardQuizSessionBySessionIdSwr"
import { useQueryFlashcardCardsByIdsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFlashcardCardsByIdsSwr"
import { _FlashcardQuizResult, type FlashcardQuizResultPerCardRow } from "./component"

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
export interface FlashcardQuizResultProps {
    /** The finished "Quick quiz" session to recap. */
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

/** Status bucket → the presentational tone (chip/dot colour). */
const TONE_BY_STATUS: Record<PerCardStatus, "success" | "warning" | "danger"> = {
    ok: "success",
    partial: "warning",
    none: "danger",
}

/**
 * The URL-addressable RESULT surface for a finished "Quick quiz" run — the CONNECTED
 * half: resolves the session (live hand-off or by-id revisit), re-hydrates the
 * per-card text, reads the enrollment flags, builds every deep link, and resolves
 * every i18n string, handing it all to the presentational {@link _FlashcardQuizResult}.
 * See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link FlashcardQuizResultProps}
 */
export const FlashcardQuizResult = ({
    sessionId,
    courseId,
    courseDisplayId,
    onBack,
    live,
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

    // first load, nothing in hand (loading-and-skeleton.md §2) — a background
    // revalidation never re-flashes the skeleton over content already on screen.
    const isSkeleton = !data && !sessionSwr.error
    const isEmpty = !isSkeleton && !data

    // per-card breakdown needs the card TEXT — the persisted `results` carry only
    // blank counts by id, so re-hydrate the text (both paths, one code path). A
    // NESTED async region: its own first-load flag, independent of the session's.
    const resultCardIds = useMemo(() => (data?.results ?? []).map((result) => result.cardId), [data])
    const cardsSwr = useQueryFlashcardCardsByIdsSwr(resultCardIds, courseId)
    const cardById = useMemo(
        () => new Map((cardsSwr.data ?? []).map((card) => [card.cardId, card])),
        [cardsSwr.data],
    )
    const isPerCardSkeleton = !cardsSwr.data && !cardsSwr.error

    const perCardRows: Array<FlashcardQuizResultPerCardRow> = useMemo(() => {
        if (!data) {
            return []
        }
        return data.results.map((result, index) => {
            const status = classify(result.correctBlanks, result.totalBlanks)
            const card = cardById.get(result.cardId)
            return {
                key: `${result.cardId}-${index}`,
                title: card?.front ?? t("flashcard.quiz.result.cardFallback", { index: index + 1 }),
                tone: TONE_BY_STATUS[status],
                statusLabel: t(`flashcard.quiz.result.cardStatus.${status}`),
                scoreLabel: t("flashcard.quiz.result.cardScore", {
                    correct: result.correctBlanks,
                    total: result.totalBlanks,
                }),
            }
        })
    }, [data, cardById, t])

    // deep-link builders for the weak-tags demand-bridge + the readiness cross-link —
    // independent of `data` (only need locale/courseDisplayId), so no guard needed.
    const learn = pathConfig().locale(locale).course(courseDisplayId).learn()
    const genericContinueHref = learn.module().build()
    const mockInterviewHref = learn.mockInterview().build()
    // resolves a weak tag straight to its lesson when the deck→lesson mapping was
    // unambiguous; `null` → the presentational half falls back to `genericContinueHref`.
    const resolveTagHref = (tag: QuizSessionWeakTagData): string | null => (
        tag.moduleId && tag.contentId
            ? learn.module(tag.moduleId).content(tag.contentId).build()
            : tag.moduleId
                ? learn.module(tag.moduleId).build()
                : null
    )
    const topWeakTags = data?.weakTags.slice(0, 3) ?? []
    const overflowWeakTags = data?.weakTags.slice(3) ?? []

    return (
        <_FlashcardQuizResult
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={!data ? sessionSwr.error : undefined}
            onRetry={() => { void sessionSwr.mutate() }}
            onBack={onBack}
            breadcrumbLabel={t("flashcard.title")}
            headerTitle={t("flashcard.quiz.result.title")}
            headerDescription={t("flashcard.quiz.result.subtitle")}
            fallbackTitle={t("flashcard.quiz.result.fallback")}
            backToReviewLabel={t("flashcard.quiz.result.backToReview")}
            coverage={data?.coverage ?? null}
            xpEarned={data?.xpEarned ?? 0}
            fullyCorrectCount={data?.fullyCorrectCount ?? 0}
            cardCount={data?.cardCount ?? 0}
            coverageLabel={t("flashcard.quiz.result.coverageLabel")}
            xpLabel={t("flashcard.quiz.result.xpLabel")}
            fullyCorrectLabel={t("flashcard.quiz.result.fullyCorrectLabel")}
            dailyCapReached={Boolean(live?.dailyCapReached)}
            dailyCapReachedLabel={t("flashcard.quiz.dailyCapReached")}
            hasPerCardResults={Boolean(data && data.results.length > 0)}
            isPerCardSkeleton={isPerCardSkeleton}
            perCardSkeletonCount={data ? Math.min(data.results.length, 5) : 0}
            perCardRows={perCardRows}
            perCardHeading={t("flashcard.quiz.result.perCardHeading")}
            enrolled={enrolled}
            enrollKnown={enrollKnown}
            topWeakTags={topWeakTags}
            overflowWeakTags={overflowWeakTags}
            resolveTagHref={resolveTagHref}
            genericContinueHref={genericContinueHref}
            studyHeading={t("flashcard.quiz.result.studyHeading")}
            courseId={courseId}
            courseDisplayId={courseDisplayId}
            readiness={live?.readiness ?? null}
            mockInterviewHref={mockInterviewHref}
        />
    )
}
