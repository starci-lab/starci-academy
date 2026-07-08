import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { mutateStartMockInterviewSession } from "@/modules/api/graphql/mutations/mutation-start-mock-interview-session"
import { type StartMockInterviewSessionRequest } from "@/modules/api/graphql/mutations/types/start-mock-interview-session"
import { useAppSelector } from "@/redux/hooks"

type MutateStartMockInterviewSessionResult = Awaited<
    ReturnType<typeof mutateStartMockInterviewSession>
>

/**
 * SWR mutation for {@link mutateStartMockInterviewSession}. Mock interview is
 * an enrolled-only feature (server draw scopes the capstone pool by
 * enrollment progress), so the `X-Course-Id` header is sent for the backend
 * `GraphQLMustEnrolledGuard` — alongside the Keycloak session.
 */
export const useMutateStartMockInterviewSessionSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateStartMockInterviewSessionResult,
        Error,
        string,
        StartMockInterviewSessionRequest
    >(
        "MUTATE_START_MOCK_INTERVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            // drawing a session is enrolled-only — fail fast when signed out / no course context
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            const headers: GraphQLHeaders | undefined = courseId
                ? { [GraphQLHeadersKey.XCourseId]: courseId }
                : undefined
            return mutateStartMockInterviewSession({
                request: arg,
                headers,
            })
        },
    )
    return swr
}
