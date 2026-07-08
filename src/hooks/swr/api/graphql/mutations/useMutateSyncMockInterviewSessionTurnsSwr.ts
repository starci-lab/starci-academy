import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { mutateSyncMockInterviewSessionTurns } from "@/modules/api/graphql/mutations/mutation-sync-mock-interview-session-turns"
import { type SyncMockInterviewSessionTurnsRequest } from "@/modules/api/graphql/mutations/types/sync-mock-interview-session-turns"
import { useAppSelector } from "@/redux/hooks"

type MutateSyncMockInterviewSessionTurnsResult = Awaited<
    ReturnType<typeof mutateSyncMockInterviewSessionTurns>
>

/**
 * SWR mutation for {@link mutateSyncMockInterviewSessionTurns}. Best-effort,
 * fire-and-forget persistence of the in-progress transcript — callers should
 * NOT `await` this before continuing the interview, and should swallow errors
 * (`.catch(() => {})`): a failed sync only degrades resumability, it never
 * blocks the live session. Sends the `X-Course-Id` header for the same
 * `GraphQLMustEnrolledGuard` the rest of the mock-interview mutations use.
 */
export const useMutateSyncMockInterviewSessionTurnsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncMockInterviewSessionTurnsResult,
        Error,
        string,
        SyncMockInterviewSessionTurnsRequest
    >(
        "MUTATE_SYNC_MOCK_INTERVIEW_SESSION_TURNS_SWR",
        async (_key, { arg }) => {
            // best-effort — fail fast when signed out / no course context, same as the
            // rest of the mock-interview mutations, but the caller is expected to swallow it
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            const headers: GraphQLHeaders | undefined = courseId
                ? { [GraphQLHeadersKey.XCourseId]: courseId }
                : undefined
            return mutateSyncMockInterviewSessionTurns({
                request: arg,
                headers,
            })
        },
    )
    return swr
}
