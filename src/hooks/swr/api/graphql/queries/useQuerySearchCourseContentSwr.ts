import useSWR from "swr"
import { querySearchCourseContent } from "@/modules/api/graphql/queries/query-search-course-content"

/**
 * SWR query wrapper for {@link querySearchCourseContent}. `data` is the
 * unwrapped array of matched results (or `[]` when absent). Disabled (key =
 * `null`, no fetch) whenever `enabled` is false or `searchQuery` is blank —
 * the caller debounces keystrokes before flipping `searchQuery` so this never
 * fires an embedding call per keystroke.
 */
export const useQuerySearchCourseContentSwr = (
    courseId: string | null,
    searchQuery: string,
    enabled: boolean,
) => {
    const trimmed = searchQuery.trim()
    const swr = useSWR(
        enabled && courseId && trimmed ? ["QUERY_SEARCH_COURSE_CONTENT_SWR", courseId, trimmed] : null,
        async () => {
            const data = await querySearchCourseContent({
                courseId: courseId ?? "",
                searchQuery: trimmed,
            })

            if (!data || !data.data) {
                throw new Error("Failed to search course content")
            }

            return data.data.searchCourseContent?.data?.results ?? []
        },
    )

    return swr
}
