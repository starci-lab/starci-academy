import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { mutateGradeMockInterviewSession } from "@/modules/api/graphql/mutations/mutation-grade-mock-interview-session"
import { type GradeMockInterviewSessionRequest } from "@/modules/api/graphql/mutations/types/grade-mock-interview-session"
import { useAppSelector } from "@/redux/hooks"

type MutateGradeMockInterviewSessionResult = Awaited<
    ReturnType<typeof mutateGradeMockInterviewSession>
>

/**
 * SWR mutation for {@link mutateGradeMockInterviewSession}. Mock interview is
 * an enrolled-only feature (it spends AI credits), so the `X-Course-Id`
 * header is sent for the backend `GraphQLMustEnrolledGuard` — alongside the
 * Keycloak session.
 */
export const useMutateGradeMockInterviewSessionSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateGradeMockInterviewSessionResult,
        Error,
        string,
        GradeMockInterviewSessionRequest
    >(
        "MUTATE_GRADE_MOCK_INTERVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            // grading is enrolled-only — fail fast when signed out / no course context
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            const headers: GraphQLHeaders | undefined = courseId
                ? { [GraphQLHeadersKey.XCourseId]: courseId }
                : undefined
            return mutateGradeMockInterviewSession({
                request: arg,
                headers,
            })
        },
    )
    return swr
}
