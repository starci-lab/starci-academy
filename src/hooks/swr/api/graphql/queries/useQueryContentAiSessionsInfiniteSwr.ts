import useSWRInfinite from "swr/infinite"
import { queryContentAiSessions } from "@/modules/api/graphql/queries/query-content-ai-sessions"
import type { ContentAiSessionSummary } from "@/modules/api/graphql/queries/types/content-ai-sessions"
import { useAppSelector } from "@/redux/hooks"

/** Conversations per page (recency-first); a short page ends the list. */
export const CONTENT_AI_SESSIONS_PAGE_LIMIT = 20

/**
 * Offset-paginated SWR hook for the content-AI conversations list (infinite
 * scroll). Each page skips `index * PAGE_LIMIT`; a page shorter than the limit
 * ends the list. Re-keys on `(scope, contentId, taskId, foundationId, courseId,
 * search)` so a new search or surface switch resets to page 0. Pass
 * `enabled = false` (e.g. while the conversations view is hidden) to suspend
 * fetching. Runs only when authenticated and at least one anchor
 * (`contentId` / `taskId` / `foundationId` / `courseId`) is present.
 *
 * @param contentId - the current content (anchors the list / scopes search); omit with another anchor for a task/foundation/course list.
 * @param search - optional search query (searches the whole course).
 * @param enabled - when false, no request is made.
 * @param courseId - course to list all conversations of, when no lesson/task/foundation anchor is set.
 * @param includeArchived - when true, archived conversations are folded into the list (the "Đã lưu trữ" toggle); defaults false.
 * @param scope - the active grounding surface ("content" | "task" | "foundation" | "course").
 * @param taskId - capstone task to list conversations of, on the task surface.
 * @param foundationId - foundation doc to list conversations of, on the foundation surface.
 */
export const useQueryContentAiSessionsInfiniteSwr = (
    contentId: string | undefined,
    search: string | undefined,
    enabled = true,
    courseId?: string,
    includeArchived = false,
    scope?: string,
    taskId?: string,
    foundationId?: string,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const trimmed = (search ?? "").trim()

    const getKey = (
        index: number,
        previous: ReadonlyArray<ContentAiSessionSummary> | null,
    ): readonly [string, string, string, string, string, string, string, boolean, number] | null => {
        if (!enabled || !authenticated || !(contentId || taskId || foundationId || courseId)) {
            return null
        }
        if (previous && previous.length < CONTENT_AI_SESSIONS_PAGE_LIMIT) {
            return null
        }
        return [
            "QUERY_CONTENT_AI_SESSIONS_INFINITE_SWR",
            scope ?? "",
            contentId ?? "",
            taskId ?? "",
            foundationId ?? "",
            courseId ?? "",
            trimmed,
            includeArchived,
            index * CONTENT_AI_SESSIONS_PAGE_LIMIT,
        ]
    }

    return useSWRInfinite(
        getKey,
        async ([, currentScope, currentContentId, currentTaskId, currentFoundationId, currentCourseId, currentSearch, currentIncludeArchived, offset]) => {
            const data = await queryContentAiSessions({
                scope: currentScope || undefined,
                contentId: currentContentId || undefined,
                taskId: currentTaskId || undefined,
                foundationId: currentFoundationId || undefined,
                courseId: currentCourseId || undefined,
                search: currentSearch || undefined,
                includeArchived: currentIncludeArchived,
                limit: CONTENT_AI_SESSIONS_PAGE_LIMIT,
                offset,
            })
            return data?.data?.sessions ?? []
        },
    )
}
