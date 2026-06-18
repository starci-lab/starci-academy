"use client"

import React from "react"
import useSWR from "swr"
import { ChartLineUpIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { queryMyFlashcardStats } from "@/modules/api/graphql"
import { AsyncContent, LabeledCard, Skeleton, StatPair } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardStatsStrip}. */
export type FlashcardStatsStripProps = WithClassNames<undefined>

/**
 * The flashcards home progress strip: the viewer's review streak, retention rate,
 * and total reviewed — read off the `myFlashcardStats` projection. Auto-hides
 * until the learner has reviewed at least one card (no history → nothing to show).
 * @param props - {@link FlashcardStatsStripProps}
 */
export const FlashcardStatsStrip = ({ className }: FlashcardStatsStripProps) => {
    const t = useTranslations()

    const { data, isLoading, error, mutate } = useSWR(
        ["my-flashcard-stats"],
        async () => {
            const response = await queryMyFlashcardStats({})
            return response.data?.myFlashcardStats.data ?? null
        },
    )

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={
                <div className="flex flex-wrap gap-6">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="flex w-20 flex-col gap-0">
                            <Skeleton.Typography type="h4" width="3/4" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                        </div>
                    ))}
                </div>
            }
            isEmpty={(data?.totalReviewed ?? 0) === 0}
            error={error}
            errorContent={{
                title: t("flashcard.empty"),
                onRetry: () => { void mutate() },
            }}
        >
            <LabeledCard
                className={className}
                label={t("flashcard.stats.label")}
                icon={<ChartLineUpIcon className="size-5" aria-hidden focusable="false" />}
            >
                <div className="flex flex-wrap gap-6">
                    <StatPair value={data?.currentStreak ?? 0} label={t("flashcard.stats.streak")} />
                    <StatPair value={`${data?.retentionRate ?? 0}%`} label={t("flashcard.stats.retention")} />
                    <StatPair value={data?.totalReviewed ?? 0} label={t("flashcard.stats.reviewed")} />
                </div>
            </LabeledCard>
        </AsyncContent>
    )
}
