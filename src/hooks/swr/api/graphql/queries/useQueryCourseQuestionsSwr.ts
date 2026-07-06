import useSWR from "swr"
import { queryCourseQuestions } from "@/modules/api/graphql/queries/query-course-questions"
import type {
    CourseQuestionFilter,
    QueryCourseQuestionsPayload,
} from "@/modules/api/graphql/queries/types/course-questions"
import { useAppSelector } from "@/redux/hooks"

/** Arguments for {@link useQueryCourseQuestionsSwr}. */
export interface UseQueryCourseQuestionsSwrArgs {
    /** Status/scope filter driving the returned list. */
    filter: CourseQuestionFilter
    /** Full-text search over question bodies (already debounced by the caller). */
    search: string
    /** 1-based page number. */
    page: number
}

/**
 * SWR wrapper for {@link queryCourseQuestions}. `data` is a page of course-wide
 * questions plus the total count, or `null`. Course-scoped — reads the active
 * course id from Redux (mirrors {@link import("@/components/features/learn/Leaderboard/useLeaderboardSwr").useLeaderboardSwr})
 * and suspends until the course hydrates. The key carries courseId + filter +
 * search + page so each filter/search/page combination is cached independently.
 *
 * @param args - {@link UseQueryCourseQuestionsSwrArgs}
 */
export const useQueryCourseQuestionsSwr = ({
    filter,
    search,
    page,
}: UseQueryCourseQuestionsSwrArgs) => {
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // trimmed search — empty string means "no search filter" for both key + request
    const normalizedSearch = search.trim()
    return useSWR<QueryCourseQuestionsPayload | null>(
        courseId
            ? ["QUERY_COURSE_QUESTIONS_SWR", courseId, filter, normalizedSearch, page]
            : null,
        async () => {
            const response = await queryCourseQuestions({
                request: {
                    courseId: courseId as string,
                    filter,
                    search: normalizedSearch || null,
                    page,
                },
            })
            return response.data?.courseQuestions.data ?? null
        },
    )
}
