import useSWR from "swr"
import { queryMockInterviewPrompts } from "@/modules/api/graphql/queries/query-mock-interview-prompts"
import type { QueryMockInterviewPromptsResponseData } from "@/modules/api/graphql/queries/types/mock-interview-prompts"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMockInterviewPrompts}. `data` is the course's mock
 * interview prompt bank (capstone systems), or `null`. Course-scoped and
 * enrolled-only — only runs once a `courseId` is known and the viewer is
 * authenticated. Sends `X-Course-Id` so the backend `GraphQLMustEnrolledGuard`
 * (which reads the header, not the query variable) can check enrollment.
 *
 * @param courseId - course whose capstone systems seed the prompt bank.
 */
export const useQueryMockInterviewPromptsSwr = (courseId: string | undefined) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMockInterviewPromptsResponseData | null>(
        courseId && authenticated ? ["QUERY_MOCK_INTERVIEW_PROMPTS_SWR", courseId] : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent
            const result = await queryMockInterviewPrompts({
                request: { courseId },
                headers,
            })
            return result.data?.mockInterviewPrompts?.data ?? null
        },
    )
}
