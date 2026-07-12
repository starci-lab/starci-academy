"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useMutateStartFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateStartFlashcardDueReviewSessionSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"

/**
 * Start a FRESH cross-deck "Đến hạn hôm nay" (due) review session EAGERLY,
 * right from the CTA that opens it (`DueReviewHero`'s "Ôn N thẻ" button) —
 * mirrors {@link useStartFlashcardReviewSession} / `QuizSession`'s own
 * `startSession`: the CTA goes `isPending` while the session persists, and
 * the caller only `router.push`es once a real sessionId comes back (thầy
 * 2026-07-11: "bấm vô học thì isPending ở cái nút học, ôn 55 thẻ cũng
 * isPending").
 *
 * ALWAYS calls `start` directly — no resumable-lookup-and-reuse here anymore
 * (thầy 2026-07-12: "nếu đang có session bỏ dở => override lại session đó
 * (xóa cũ tạo mới)"). The `start` mutation itself already retires any prior
 * `in_progress` draw for the enrollment before persisting the new one
 * (`FlashcardDueReviewSessionService.start`), so this button always means
 * "begin now" — resuming a dangling session is a SEPARATE, explicit choice
 * via the dedicated `ContinueCard` (`DueReviewHero`'s own resume card, fed by
 * `useQueryMyInProgressFlashcardDueReviewSessionSwr`). Removing the
 * check-then-reuse race here also fixes 2 bugs it caused: clicking "Học"
 * sometimes landing straight on the results page (a resumable session that
 * had already flipped to non-in_progress by the time it was reused), and the
 * due-review sessionId changing on every click (two independent resolve-or-
 * start paths racing each other to decide reuse-vs-create).
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
