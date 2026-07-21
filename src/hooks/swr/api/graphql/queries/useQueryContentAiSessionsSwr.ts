import useSWR from "swr"
import { queryContentAiSessions } from "@/modules/api/graphql/queries/query-content-ai-sessions"
import type { ContentAiSessionSummary } from "@/modules/api/graphql/queries/types/content-ai-sessions"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR query wrapper for {@link queryContentAiSessions}. Lists the current user's
 * content-AI conversations for the active grounding surface — a lesson content, a
 * capstone task, a challenge, a flashcard-quiz deck, a foundation doc, or the
 * whole course — selected by `scope` plus the matching anchor id. When `search` is
 * non-empty it searches ALL their conversations in the course. Runs only when
 * authenticated and at least one anchor (`contentId` / `taskId` / `challengeId` /
 * `quizId` / `foundationId` / `courseId`) is present.
 */
export const useQueryContentAiSessionsSwr = (
    contentId: string | undefined,
    search?: string,
    courseId?: string,
    scope?: string,
    taskId?: string,
    foundationId?: string,
    challengeId?: string,
    quizId?: string,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const trimmed = (search ?? "").trim()
    const swr = useSWR<Array<ContentAiSessionSummary>>(
        authenticated && (contentId || taskId || challengeId || quizId || foundationId || courseId)
            ? [
                "QUERY_CONTENT_AI_SESSIONS_SWR",
                scope,
                contentId,
                taskId,
                challengeId,
                quizId,
                foundationId,
                courseId,
                trimmed,
            ]
            : null,
        async () => {
            const data = await queryContentAiSessions({
                scope,
                contentId,
                taskId,
                challengeId,
                quizId,
                foundationId,
                courseId,
                search: trimmed || undefined,
            })
            return data?.data?.sessions ?? []
        },
    )
    return swr
}
