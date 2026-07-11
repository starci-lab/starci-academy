"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { queryMyInProgressFlashcardReviewSession } from "@/modules/api/graphql/queries/query-my-in-progress-flashcard-review-session"
import { useMutateStartFlashcardReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardReviewSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"

/**
 * Resolve-or-start a deck's "Học thẻ" review session EAGERLY, right from the
 * CTA that opens it (`FlashcardDeckList`'s "Học" button) — mirrors
 * `QuizSession`'s own `startSession`: the CTA goes `isPending` while a
 * resumable session is looked up (or a fresh one persisted), and the caller
 * only `router.push`es once a real sessionId comes back (thầy 2026-07-11:
 * "học là dùng router.push chứ không phải redirect", "bấm vô học thì isPending
 * ở cái nút học"). Replaces navigating INSTANTLY to the bare shim route
 * (`review?deckId=`) and showing a full-page skeleton there — that shim still
 * exists for direct/shared links, this is the fast in-place path for a click.
 */
export const useStartFlashcardReviewSession = (courseId: string | undefined) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const runStartSession = useMutateStartFlashcardReviewSessionSwr()
    // deck currently resolving/starting — only one CTA can be pending at a time
    const [startingDeckId, setStartingDeckId] = useState<string | null>(null)

    const start = useCallback(
        async (deckId: string, cardIds: Array<string>): Promise<string | null> => {
            if (!courseId || startingDeckId) {
                return null
            }
            setStartingDeckId(deckId)
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }

            const resumable = await queryMyInProgressFlashcardReviewSession({ request: { deckId }, headers })
                .then((result) => result.data?.myInProgressFlashcardReviewSession?.data ?? null)
                .catch(() => null)
            if (resumable) {
                return resumable.sessionId
            }

            let freshId: string | null = null
            const ok = await runGraphQL(
                async () => {
                    const result = await runStartSession.trigger({ request: { deckId, cardIds }, headers })
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
