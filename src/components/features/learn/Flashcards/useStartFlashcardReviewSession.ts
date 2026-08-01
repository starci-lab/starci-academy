"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useMutateStartFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardReviewSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import type { FlashcardReviewMode } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"

/**
 * Start a FRESH deck "Study Cards" review session EAGERLY, right from the CTA
 * that opens it (`FlashcardDeckList`'s "Study" button) — mirrors
 * `QuizSession`'s own `startSession`: the CTA goes `isPending` while the
 * session persists, and the caller only `router.push`es once a real
 * sessionId comes back (teacher 2026-07-11: "studying uses router.push, not
 * a redirect", "pressing the study button puts isPending on that button").
 *
 * ALWAYS calls `start` directly — no resumable-lookup-and-reuse here anymore
 * (teacher 2026-07-12: "if there's an abandoned session in progress, override
 * it (delete the old one, create a new one)", mirrors the identical fix on
 * {@link import("./useStartFlashcardDueReviewSession").useStartFlashcardDueReviewSession}).
 * The `start` mutation already retires any prior `in_progress` draw for the
 * enrollment+deck before persisting the new one
 * (`FlashcardReviewSessionService.start`), so this button always means
 * "begin now" — resuming stays a separate, explicit choice elsewhere.
 */
export const useStartFlashcardReviewSession = (courseId: string | undefined) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const runStartSession = useMutateStartFlashcardReviewSessionSwr()
    // deck currently resolving/starting — only one CTA can be pending at a time
    const [startingDeckId, setStartingDeckId] = useState<string | null>(null)

    const start = useCallback(
        async (deckId: string, cardIds: Array<string>, mode: FlashcardReviewMode = "full"): Promise<string | null> => {
            if (!courseId || startingDeckId) {
                return null
            }
            setStartingDeckId(deckId)
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }

            let freshId: string | null = null
            const ok = await runGraphQL(
                async () => {
                    // `mode` picks the scope server-side: "due" persists only the
                    // cards needing review (teacher 2026-07-13 mode modal); "full"
                    // (default) keeps the whole deck.
                    const result = await runStartSession.trigger({ request: { deckId, cardIds, mode }, headers })
                    const response = result.data?.startFlashcardReviewSession
                    freshId = response?.data?.sessionId ?? null
                    return response ?? { success: false, message: t("flashcard.review.error") }
                },
                { showSuccessToast: false },
            )
            if (!ok || !freshId) {
                setStartingDeckId(null)
                return null
            }
            // deliberately no `setStartingDeckId(null)` on success — the caller is
            // about to `router.push` away, so the CTA stays visibly pending right up
            // until the destination page takes over (mirrors QuizSession's own
            // `startSession`, which leaves `starting` on for the same reason).
            return freshId
        },
        [courseId, startingDeckId, runGraphQL, runStartSession, t],
    )

    return { start, startingDeckId }
}
