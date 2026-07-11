"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { queryMyInProgressFlashcardDueReviewSession } from "@/modules/api/graphql/queries/query-my-in-progress-flashcard-due-review-session"
import { useMutateStartFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardDueReviewSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"

/**
 * Resolve-or-start the cross-deck "Đến hạn hôm nay" (due) review session
 * EAGERLY, right from the CTA that opens it (`DueReviewHero`'s "Ôn N thẻ"
 * button) — mirrors {@link useStartFlashcardReviewSession} /
 * `QuizSession`'s own `startSession`: the CTA goes `isPending` while a
 * resumable session is looked up (or a fresh one persisted), and the caller
 * only `router.push`es once a real sessionId comes back (thầy 2026-07-11:
 * "bấm vô học thì isPending ở cái nút học, ôn 55 thẻ cũng isPending").
 */
export const useStartFlashcardDueReviewSession = (courseId: string | undefined) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const runStartSession = useMutateStartFlashcardDueReviewSessionSwr()
    const [starting, setStarting] = useState(false)

    const start = useCallback(
        async (cardIds: Array<string>): Promise<string | null> => {
            if (!courseId || starting) {
                return null
            }
            setStarting(true)
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }

            const resumable = await queryMyInProgressFlashcardDueReviewSession({ request: { courseId }, headers })
                .then((result) => result.data?.myInProgressFlashcardDueReviewSession?.data ?? null)
                .catch(() => null)
            if (resumable) {
                return resumable.sessionId
            }

            let freshId: string | null = null
            const ok = await runGraphQL(
                async () => {
                    const result = await runStartSession.trigger({ request: { courseId, cardIds }, headers })
                    const response = result.data?.startFlashcardDueReviewSession
                    freshId = response?.data?.sessionId ?? null
                    return response ?? { success: false, message: t("flashcard.review.error") }
                },
                { showSuccessToast: false },
            )
            if (!ok || !freshId) {
                setStarting(false)
                return null
            }
            // deliberately no `setStarting(false)` on success — the caller is about to
            // `router.push` away, so the CTA stays visibly pending right up until the
            // destination page takes over (mirrors QuizSession's own `startSession`).
            return freshId
        },
        [courseId, starting, runGraphQL, runStartSession, t],
    )

    return { start, starting }
}
