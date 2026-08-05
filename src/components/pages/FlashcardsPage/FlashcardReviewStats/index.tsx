"use client"

import React from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { queryMyFlashcardReviewStats } from "@/modules/api/graphql/queries/query-my-flashcard-review-stats"
import { queryMyFlashcardStats } from "@/modules/api/graphql/queries/query-my-flashcard-stats"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { _FlashcardReviewStats, RETENTION_MIN_REVIEWS, RETENTION_TARGET, retentionColorOf } from "./component"

/** Props for {@link FlashcardReviewStats}. */
export interface FlashcardReviewStatsProps {
    /** Course whose aggregate "Study Cards" review stats to show. */
    courseId: string
    /** Jumps the overview tab strip back to the study overview (empty-state action). */
    onStartReview?: () => void
}

/**
 * "Study Cards" aggregate stats — the CONNECTED half: fetches the course-scoped review stats +
 * the lifetime gate signal, computes the verdict band and every i18n string (incl.
 * interpolation), and hands them to the presentational {@link _FlashcardReviewStats}. See
 * `design/storybook/architecture/tiers/split.md`.
 *
 * @param props - {@link FlashcardReviewStatsProps}
 */
export const FlashcardReviewStats = ({ courseId, onStartReview }: FlashcardReviewStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)

    const statsSwr = useSWR(
        ["flashcard-review-stats", courseId],
        async () => {
            const response = await queryMyFlashcardReviewStats({ request: { courseId } })
            return response.data?.myFlashcardReviewStats.data ?? null
        },
    )
    // lifetime review count — reused only for the loading gate (matches the old
    // `&& !a.data && !b.data` shape: a resolved-lifetime/pending-stats tick must not briefly
    // render "no data yet" over a course that actually has reviews).
    const lifetimeSwr = useSWR(
        ["my-flashcard-stats"],
        async () => {
            const response = await queryMyFlashcardStats({})
            return response.data?.myFlashcardStats.data ?? null
        },
    )

    // first load, nothing in hand from EITHER source → shimmer (loading-and-skeleton.md §2)
    const isSkeleton = (statsSwr.isLoading && !statsSwr.data) || (lifetimeSwr.isLoading && !lifetimeSwr.data)
    const stats = statsSwr.data
    // COURSE-SCOPED floor + headline (2026-07-17 fix): `reviewedTotal`/`courseRetention` count
    // only THIS course, never the per-user lifetime projection.
    const totalReviewed = stats?.reviewedTotal ?? 0
    const retentionRate = stats?.courseRetention ?? 0
    const weakTags = stats?.weakTags ?? []
    const weakestTag = weakTags[0] ?? null
    const leechFocus = stats?.leechFocus ?? []
    const matureRetention = stats?.matureRetention ?? 0
    const youngRetention = stats?.youngRetention ?? 0
    // deck to drill from a CTA: the lowest-retention deck, else the top leech card's own deck —
    // the ONE onward action every zone/row shares.
    const weakestDeckId = stats?.deckRetention?.[0]?.deckId ?? leechFocus[0]?.deckId ?? null
    /** Open a deck's reviewer. */
    const openDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(displayId).learn().flashcards().review(deckId).build(),
    )

    // Overall average over the FULL worst-first list, for the "the average conceals topic X" caption.
    const weakTagAvg = weakTags.length > 0
        ? Math.round(weakTags.reduce((sum, tag) => sum + tag.retention, 0) / weakTags.length)
        : 0

    // Verdict sentence/caption/CTA chosen BY BAND: danger→overload, warning→leaking, success→healthy.
    const band = retentionColorOf(retentionRate)
    const verdictKey = band === "danger"
        ? "flashcard.review.verdictOverloadSentence"
        : band === "warning"
            ? "flashcard.review.verdictLeakingSentence"
            : "flashcard.review.verdictHealthySentence"
    const captionKey = band === "danger"
        ? "flashcard.review.verdictOverloadCaption"
        : band === "warning"
            ? "flashcard.review.verdictLeakingCaption"
            : "flashcard.review.verdictHealthyCaption"
    // "Reduce new cards" only fits the overloaded case; other bands drill the weakest deck.
    const ctaKey = band === "danger" ? "flashcard.review.reduceNewCardsCta" : "flashcard.review.reviewWeakestCta"

    return (
        <_FlashcardReviewStats
            isSkeleton={isSkeleton}
            isEmpty={totalReviewed < RETENTION_MIN_REVIEWS}
            error={!stats ? statsSwr.error : undefined}
            onRetry={() => { void statsSwr.mutate() }}
            onStartReview={onStartReview}
            retentionRate={retentionRate}
            matureRetention={matureRetention}
            youngRetention={youngRetention}
            weakTags={weakTags.map((tag) => ({
                tag: tag.tag,
                retention: tag.retention,
                chipLabel: t("flashcard.review.deckRetentionChip", { retention: tag.retention }),
            }))}
            weakestDeckId={weakestDeckId}
            weakTopicDrillCta={weakestDeckId && weakestTag
                ? t("flashcard.review.weakTopicDrillCta", { tag: weakestTag.tag })
                : undefined}
            weakTopicAvgCaption={weakestTag
                ? t("flashcard.review.weakTopicAvgCaption", {
                    avg: weakTagAvg,
                    tag: weakestTag.tag,
                    low: weakestTag.retention,
                })
                : undefined}
            onOpenDeck={openDeck}
            courseId={courseId}
            displayId={displayId}
            labels={{
                errorTitle: t("flashcard.review.statsError"),
                retry: t("flashcard.review.retry"),
                emptyTitle: t("flashcard.review.statsEmptyTitle"),
                emptyDescription: t("flashcard.review.statsEmptyDescription"),
                emptyAction: t("flashcard.review.historyEmptyAction"),
                memoryHealthLabel: t("flashcard.review.memoryHealthLabel"),
                verdict: t.rich(verdictKey, {
                    b: (chunks) => <b>{chunks}</b>,
                }),
                sub: t(captionKey, {
                    retention: retentionRate,
                    target: RETENTION_TARGET,
                }),
                cta: t(ctaKey),
                matureSplitLabel: (
                    <>
                        {t("flashcard.review.matureSplitLabel")}
                        <br />
                        {t("flashcard.review.matureSplitCaption")}
                    </>
                ),
                youngSplitLabel: (
                    <>
                        {t("flashcard.review.youngSplitLabel")}
                        <br />
                        {t("flashcard.review.youngSplitCaption")}
                    </>
                ),
                weakTopicMapLabel: t("flashcard.review.weakTopicMapLabel"),
                studyHeading: t("flashcard.review.stats.studyHeading"),
            }}
        />
    )
}
