"use client"

import React from "react"
import useSWR from "swr"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SurfaceListCard, SurfaceListCardRow, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { VerdictHeroCard } from "@/components/blocks/stats/VerdictHeroCard"
import { queryMyFlashcardReviewStats } from "@/modules/api/graphql/queries/query-my-flashcard-review-stats"
import { queryMyFlashcardStats } from "@/modules/api/graphql/queries/query-my-flashcard-stats"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Retention band BY VALUE — drives `VerdictHeroCard`'s color + every retention chip here. */
const retentionColorOf = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 75 ? "warning" : "success"

/** Props for {@link FlashcardReviewStats}. */
export interface FlashcardReviewStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate "Học thẻ" review stats to show. */
    courseId: string
    /** Jumps the overview tab strip back to the study overview (empty-state action). */
    onStartReview?: () => void
}

/** Below this many lifetime reviews the aggregates are noise — mirrors
 *  `FlashcardStatsStrip`'s own `RETENTION_MIN_REVIEWS` gate constant. */
const RETENTION_MIN_REVIEWS = 5

/** Healthy-memory retention mark the hero meter aims at (`stats-insight-redesign`
 *  proposal — FE-side constant; the BE intentionally has no such column). */
const RETENTION_TARGET = 85

/**
 * "Học thẻ" aggregate stats — the study overview's "Thống kê" tab, insight-first
 * (verdict → evidence → action, `stats-canonical-fold` — rút gọn về 1 hero + 1
 * zone): (1) memory-health hero (mature/young split vs target), (2) full
 * weak-topic map worst-first. Gated behind the same lifetime-review floor so a
 * near-empty history doesn't read as broken.
 * @param props - {@link FlashcardReviewStatsProps}
 */
export const FlashcardReviewStats = ({ courseId, onStartReview, className }: FlashcardReviewStatsProps) => {
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
    // lifetime review count — reused only for the empty-state gate (same signal
    // `FlashcardStatsStrip` reads for its own retention caption) + the headline
    // retention value + the leech-focus "% of your Again grades" denominator.
    const lifetimeSwr = useSWR(
        ["my-flashcard-stats"],
        async () => {
            const response = await queryMyFlashcardStats({})
            return response.data?.myFlashcardStats.data ?? null
        },
    )

    // Loading while EITHER source is still in flight — the old `&& !a.data && !b.data`
    // form went false as soon as the FIRST resolved, which now matters: the empty-state
    // floor reads the course-scoped `stats`, so a resolved-lifetime/pending-stats tick
    // would briefly render "chưa có dữ liệu" over a course that actually has reviews.
    const isLoading = (statsSwr.isLoading && !statsSwr.data) || (lifetimeSwr.isLoading && !lifetimeSwr.data)
    const stats = statsSwr.data
    // COURSE-SCOPED floor + headline (2026-07-17 fix). This tab is course-scoped, but
    // both used to read the per-USER LIFETIME projection (`myFlashcardStats`), which
    // blends every course: a learner with reviews in ANOTHER course cleared the floor
    // here and got a memory-health verdict built from foreign numbers next to empty
    // course zones. `reviewedTotal`/`courseRetention` count only THIS course.
    const totalReviewed = stats?.reviewedTotal ?? 0
    const retentionRate = stats?.courseRetention ?? 0
    // OUTCOME aggregates driving the insight zones below.
    const weakTags = stats?.weakTags ?? []
    const weakestTag = weakTags[0] ?? null
    const leechFocus = stats?.leechFocus ?? []
    const matureRetention = stats?.matureRetention ?? 0
    const youngRetention = stats?.youngRetention ?? 0
    // deck to drill from a CTA: the lowest-retention deck, else the top leech
    // card's own deck (`deckRetention`/`leechFocus` are both worst/most-painful
    // first) — the ONE onward action every zone below shares.
    const weakestDeckId = stats?.deckRetention?.[0]?.deckId ?? leechFocus[0]?.deckId ?? null
    /** Open a deck's reviewer (the single onward action shared by every row/CTA here). */
    const openDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(displayId).learn().flashcards().review(deckId).build(),
    )

    // Trung bình chung + "TB giấu chủ đề X" — computed over the FULL worst-first
    // list (not just the single `weakReviewTag` head) so the caption's average
    // actually reflects every tag rendered above it.
    const weakTagAvg = weakTags.length > 0
        ? Math.round(weakTags.reduce((sum, tag) => sum + tag.retention, 0) / weakTags.length)
        : 0

    return (
        <AsyncContent
            isLoading={isLoading}
            skeleton={(
                // MIRROR the loaded tree: ZONE 1 label + memory-health hero (value ·
                // verdict · sub · meter · 2-up split · CTA), ZONE 2 label + weak-topic
                // SurfaceListCard with a drill CTA + avg caption OUTSIDE the card.
                <div className="flex flex-col gap-6">
                    {/* ZONE 1 — "Sức khoẻ trí nhớ" hero */}
                    <section className="flex flex-col gap-3">
                        <Skeleton className="h-[14px] w-40 rounded" />
                        <SectionCard>
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-9 w-20 rounded" />
                                <Skeleton className="h-[14px] w-6 rounded" />
                            </div>
                            <Skeleton.Typography type="body-sm" width="3/4" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                            <Skeleton.ProgressBar />
                            {/* mature/young 2-up split */}
                            <div className="flex overflow-hidden rounded-2xl border border-default">
                                {Array.from({ length: 2 }).map((_unused, index) => (
                                    <div key={index} className={cn("flex flex-1 flex-col gap-1 p-3", index > 0 && "border-l border-default")}>
                                        <Skeleton.Typography type="body-xs" width="2/3" />
                                        <Skeleton className="h-5 w-14 rounded" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton.Button width="w-40" />
                        </SectionCard>
                    </section>

                    {/* ZONE 2 — "Điểm yếu theo chủ đề": label + list, then CTA + caption below the card */}
                    <div className="flex flex-col">
                        <section className="flex flex-col gap-3">
                            <Skeleton className="h-[14px] w-40 rounded" />
                            <SurfaceListCard>
                                {Array.from({ length: 4 }).map((_unused, index) => (
                                    <SurfaceListCardItem key={index}>
                                        <div className="flex items-center justify-between gap-3">
                                            <Skeleton.Typography type="body-sm" width="1/3" />
                                            <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
                                        </div>
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
                        </section>
                        <Skeleton.Button width="w-44" className="mt-3 self-start" />
                        <Skeleton.Typography type="body-xs" width="2/3" className="mt-2" />
                    </div>
                </div>
            )}
            error={!stats ? statsSwr.error : undefined}
            errorContent={{
                title: t("flashcard.review.statsError"),
                onRetry: () => { void statsSwr.mutate() },
                retryLabel: t("flashcard.review.retry"),
            }}
        >
            {totalReviewed < RETENTION_MIN_REVIEWS ? (
                <EmptyState
                    icon={<ChartLineUpIcon aria-hidden focusable="false" />}
                    title={t("flashcard.review.statsEmptyTitle")}
                    description={t("flashcard.review.statsEmptyDescription")}
                    action={onStartReview ? (
                        <Button size="sm" variant="secondary" onPress={onStartReview}>
                            {t("flashcard.review.historyEmptyAction")}
                        </Button>
                    ) : undefined}
                />
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* ZONE 1 — "Sức khoẻ trí nhớ" hero (◎ vs target). Retention band
                        drives the card's color; the mature/young split shows WHY (cramming
                        new cards vs actually forgetting old ones) — the whole point of
                        replacing the old bare "Tỷ lệ nhớ" number. Verdict sentence/caption
                        are chosen BY BAND (2026-07-17 fix — the workflow originally shipped
                        only the "quá tải"/overload copy, so a healthy learner at ≥75% would
                        read "you're overloaded" next to a green number): danger→overload,
                        warning→leaking, success→healthy. */}
                    {(() => {
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
                        // "Giảm thẻ mới" only fits the overloaded case; other bands drill the weakest deck.
                        const ctaKey = band === "danger" ? "flashcard.review.reduceNewCardsCta" : "flashcard.review.reviewWeakestCta"
                        return (
                            <LabeledCard label={t("flashcard.review.memoryHealthLabel")} frameless>
                                <VerdictHeroCard
                                    value={retentionRate}
                                    unit="%"
                                    band={band}
                                    verdict={t.rich(verdictKey, {
                                        b: (chunks) => <b>{chunks}</b>,
                                    })}
                                    sub={t(captionKey, {
                                        retention: retentionRate,
                                        target: RETENTION_TARGET,
                                    })}
                                    meter={{ value: retentionRate, max: 100, target: RETENTION_TARGET }}
                                    splits={[
                                        {
                                            label: (
                                                <>
                                                    {t("flashcard.review.matureSplitLabel")}
                                                    <br />
                                                    {t("flashcard.review.matureSplitCaption")}
                                                </>
                                            ),
                                            value: `${matureRetention}%`,
                                            band: retentionColorOf(matureRetention),
                                        },
                                        {
                                            label: (
                                                <>
                                                    {t("flashcard.review.youngSplitLabel")}
                                                    <br />
                                                    {t("flashcard.review.youngSplitCaption")}
                                                </>
                                            ),
                                            value: `${youngRetention}%`,
                                            band: retentionColorOf(youngRetention),
                                        },
                                    ]}
                                    action={weakestDeckId ? (
                                        <Button variant="primary" size="sm" onPress={() => openDeck(weakestDeckId)}>
                                            {t(ctaKey)}
                                            <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                        </Button>
                                    ) : undefined}
                                />
                            </LabeledCard>
                        )
                    })()}

                    {/* ZONE 2 — "Điểm yếu theo chủ đề" (▽ split by tag, → drill CTA).
                        FULL worst-first list (not just the single weakest tag). */}
                    {weakTags.length > 0 ? (
                        // card's main content is a LIST → it's a labeled list-surface-card
                        // (LabeledCard frameless → SurfaceListCard, §card.md 2/3c), and the
                        // drill CTA + avg caption live OUTSIDE the card (buttons never inside a
                        // list card): CTA gap-3 below the card, text-xs caption gap-2 below CTA.
                        <div className="flex flex-col">
                            <LabeledCard label={t("flashcard.review.weakTopicMapLabel")} frameless>
                                <SurfaceListCard>
                                    {weakTags.map((tag) => (
                                        <SurfaceListCardRow
                                            key={tag.tag}
                                            title={tag.tag}
                                            meta={(
                                                <Chip size="sm" variant="soft" color={retentionColorOf(tag.retention)} className="shrink-0">
                                                    {t("flashcard.review.deckRetentionChip", { retention: tag.retention })}
                                                </Chip>
                                            )}
                                        />
                                    ))}
                                </SurfaceListCard>
                            </LabeledCard>
                            {weakestDeckId && weakestTag ? (
                                <Button variant="primary" size="sm" className="mt-3 self-start" onPress={() => openDeck(weakestDeckId)}>
                                    {t("flashcard.review.weakTopicDrillCta", { tag: weakestTag.tag })}
                                    <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                </Button>
                            ) : null}
                            {weakestTag ? (
                                <Typography type="body-xs" color="muted" className="mt-2">
                                    {t("flashcard.review.weakTopicAvgCaption", {
                                        avg: weakTagAvg,
                                        tag: weakestTag.tag,
                                        low: weakestTag.retention,
                                    })}
                                </Typography>
                            ) : null}
                        </div>
                    ) : null}

                    {/* ZONE 3 — passive RAG "Gợi ý học": weak tags → course-wide content
                        search (self-hiding when there's nothing weak / no match). Mirrors
                        `FlashcardSessionStats`'s own end-of-session study payoff. Needs the
                        slug for result deep links, so it waits on `displayId`. */}
                    {displayId ? (
                        <RelatedContentList
                            courseId={courseId}
                            courseDisplayId={displayId}
                            query={weakTags.map((tag) => tag.tag).join(" ")}
                            label={t("flashcard.review.stats.studyHeading")}
                        />
                    ) : null}

                </div>
            )}
        </AsyncContent>
    )
}
