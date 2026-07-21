import useSWRInfinite from "swr/infinite"
import { queryContentAiSessions } from "@/modules/api/graphql/queries/query-content-ai-sessions"
import type { ContentAiSessionSummary } from "@/modules/api/graphql/queries/types/content-ai-sessions"
import { useAppSelector } from "@/redux/hooks"

/** Conversations per page (recency-first); a short page ends the list. */
export const CONTENT_AI_SESSIONS_PAGE_LIMIT = 20

/**
 * Offset-paginated SWR hook for the content-AI conversations list (infinite
 * scroll). Each page skips `index * PAGE_LIMIT`; a page shorter than the limit
 * ends the list. Re-keys on `(contentId, search, courseId)` so a new search or
 * scope switch resets to page 0. Pass `enabled = false` (e.g. while the
 * conversations view is hidden) to suspend fetching. Runs only when
 * authenticated and at least one of `contentId` / `courseId` is present.
 *
 * @param contentId - the current content (anchors the list / scopes search); omit with `courseId` for a course-wide list.
 * @param search - optional search query (searches the whole course).
 * @param enabled - when false, no request is made.
 * @param courseId - course to list all conversations of, when `contentId` is omitted.
 * @param includeArchived - when true, archived conversations are folded into the list (the "Đã lưu trữ" toggle); defaults false.
 */
export const useQueryContentAiSessionsInfiniteSwr = (
    contentId: string | undefined,
    search: string | undefined,
    enabled = true,
    courseId?: string,
    includeArchived = false,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const trimmed = (search ?? "").trim()

    const getKey = (
        index: number,
        previous: ReadonlyArray<ContentAiSessionSummary> | null,
    ): readonly [string, string, string, string, boolean, number] | null => {
        if (!enabled || !authenticated || !(contentId || courseId)) {
            return null
        }
        if (previous && previous.length < CONTENT_AI_SESSIONS_PAGE_LIMIT) {
            return null
        }
        return [
            "QUERY_CONTENT_AI_SESSIONS_INFINITE_SWR",
            contentId ?? "",
            courseId ?? "",
            trimmed,
            includeArchived,
            index * CONTENT_AI_SESSIONS_PAGE_LIMIT,
        ]
    }

    return useSWRInfinite(
        getKey,
        async ([, currentContentId, currentCourseId, currentSearch, currentIncludeArchived, offset]) => {
            const data = await queryContentAiSessions({
                contentId: currentContentId || undefined,
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
