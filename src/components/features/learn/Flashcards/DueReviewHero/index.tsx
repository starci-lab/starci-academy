"use client"

import React from "react"
import useSWR from "swr"
import { Button, Spinner, Typography } from "@heroui/react"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { DUE_REVIEW_LIMIT } from "../constants"
import { useStartFlashcardDueReviewSession } from "../useStartFlashcardDueReviewSession"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyInProgressFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardDueReviewSessionSwr"
import { pathConfig } from "@/resources/path"

/** Props for {@link DueReviewHero}. */
export type DueReviewHeroProps = WithClassNames<undefined>

/**
 * The flashcards home hero: the spaced-repetition queue. Shows how many cards are
 * due today across every enrolled course and offers the page's PRIMARY action —
 * starting a review session. When nothing is due it collapses to a caught-up
 * empty state. Reads the shared `myDueFlashcards` key directly from SWR.
 * @param props - {@link DueReviewHeroProps}
 */
export const DueReviewHero = ({ className }: DueReviewHeroProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // scope the due queue to THIS course (the count must reflect this course's
    // decks, not every deck system-wide); shared SWR key with {@link DueReview}.
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const displayId = useAppSelector((state) => state.course.displayId)

    const { data, isLoading, error, mutate } = useSWR(
        ["my-due-flashcards", courseId ?? null, DUE_REVIEW_LIMIT],
        async () => {
            const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
            return response.data?.myDueFlashcards.data ?? null
        },
    )

    // eager resolve-or-start right from the CTA (thầy 2026-07-11: "bấm vô học
    // thì isPending ở cái nút học, ôn 55 thẻ cũng isPending, tạo xong session
    // xong là router push vào trang tương tự với học nhanh") — the button stays
    // ON this screen, pending, until a real sessionId comes back; no more
    // instant navigation to the bare `?session=due` shim + full-page skeleton.
    const { start: startDueReview, starting } = useStartFlashcardDueReviewSession(courseId)
    const onPressStart = async () => {
        if (!displayId) {
            return
        }
        const cardIds = (data?.cards ?? []).map((dueCard) => dueCard.cardId)
        const sessionId = await startDueReview(cardIds)
        if (sessionId) {
            router.push(pathConfig().locale(locale).course(displayId).learn().flashcards().due(sessionId).build())
        }
    }

    // resumable cross-deck "Đến hạn hôm nay" run — mirrors QuizSession's own
    // "Zone 0" resume card (thầy: "phiên dở dang cũng hiện cho phần học thẻ").
    // `ClockCounterClockwiseIcon` sunk as a background watermark reads this as
    // "pick back up a session in progress" (thầy 2026-07-11: "đồng hồ đi", picked
    // over the streak-toned FireIcon) — see `ContinueCard`'s `watermarkIcon` prop.
    const resumeSwr = useQueryMyInProgressFlashcardDueReviewSessionSwr(courseId)
    const resumeData = resumeSwr.data

    const dueCount = data?.dueCount ?? 0
    const dueReviewCount = data?.dueReviewCount ?? 0
    const newCount = data?.newCount ?? 0

    return (
        <div className="flex flex-col gap-3">
            {resumeData && displayId ? (
                <ContinueCard
                    title={t("flashcard.due.resumeTitle")}
                    subtitle={t("flashcard.due.resumeSubtitle", {
                        current: resumeData.currentIndex + 1,
                        total: resumeData.cardIds.length,
                    })}
                    value={resumeData.currentIndex}
                    max={resumeData.cardIds.length}
                    hideProgress
                    ctaLabel={t("flashcard.due.resumeCta")}
                    ctaVariant="chip"
                    ctaBelow
                    accented
                    watermarkIcon={<ClockCounterClockwiseIcon weight="fill" />}
                    onPress={() => router.push(
                        pathConfig().locale(locale).course(displayId).learn().flashcards().due(resumeData.sessionId).build(),
                    )}
                />
            ) : null}
            <LabeledCard className={className} label={t("flashcard.due.label")}>
                <AsyncContent
                    isLoading={isLoading && !data}
                    skeleton={
                        <div className="flex items-center justify-between gap-3">
                            <Skeleton.Typography type="body-sm" width="1/2" />
                            <Skeleton.Button />
                        </div>
                    }
                    isEmpty={dueCount === 0}
                    emptyContent={{
                        title: t("flashcard.due.allCaught"),
                        description: t("flashcard.due.allCaughtHint"),
                    }}
                    error={error}
                    errorContent={{
                        title: t("flashcard.empty"),
                        onRetry: () => { void mutate() },
                    }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.due.count", { count: dueCount })}
                            </Typography>
                            {/* breaks down the (possibly confusing) total into its 2 parts — only
                                when it's actually a mix, so a pure-overdue or pure-new queue doesn't
                                show a redundant "X + 0" (thầy 2026-07-09: "cái log 25 thẻ còn lại là
                                ở đâu ra" — dueCount = overdue reviews + today's capped new batch,
                                see DAILY_NEW_LIMIT in flashcard-review.service.ts). */}
                            {dueReviewCount > 0 && newCount > 0 ? (
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.due.countBreakdown", { overdue: dueReviewCount, newCapped: newCount })}
                                </Typography>
                            ) : null}
                        </div>
                        <Button variant="primary" isPending={starting} onPress={() => { void onPressStart() }}>
                            {/* `isPending` alone shows no built-in spinner (HeroUI Button ships
                                no visual for it, only disables interaction) — render one
                                ourselves, same idiom as `FollowButton`/`TierCard`. */}
                            {starting ? <Spinner color="current" size="sm" /> : null}
                            {t("flashcard.due.start", { count: dueCount })}
                        </Button>
                    </div>
                </AsyncContent>
            </LabeledCard>
        </div>
    )
}
