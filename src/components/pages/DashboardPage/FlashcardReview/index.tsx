"use client"

import React from "react"
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
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"
import { _FlashcardReview } from "./component"

/**
 * Centre-column "flashcards due today" nudge — the CONNECTED half. Surfaces
 * the SM-2 spaced-repetition backlog (`dueCount`) right on the home surface
 * with a primary CTA into the dedicated review page. Self-fetches its own
 * leaf query, resolves every label, and hands them to the presentational
 * {@link _FlashcardReview}. See `tiers/split.md`.
 */
export const FlashcardReview = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error, isLoading } = useQueryMyDueFlashcardsSwr()

    const dueCount = data?.dueCount ?? 0

    return (
        <_FlashcardReview
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && !data}
            // SECONDARY widget, no error voice of its own: nothing due, still loading (no
            // cache), or the fetch failed → self-hide (same condition the old `AsyncContent`
            // `isEmpty` folded `error` into, since no `errorContent` was ever passed).
            isEmpty={!!error || !data || dueCount === 0}
            onStartReview={() => router.push(
                pathConfig().locale(locale).review().build(),
            )}
            labels={{
                due: t("flashcardReview.due", { count: dueCount }),
                startWithCount: t("flashcardReview.startWithCount", { count: dueCount }),
            }}
        />
    )
}
