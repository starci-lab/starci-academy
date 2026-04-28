import { useKeycloakZustand } from "@/hooks/zustand"
import {
    GraphQLHeadersKey,
    mutateSyncChallengeSubmissions,
    type SyncSubmissionRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSyncChallengeSubmissionsResult = Awaited<
    ReturnType<typeof mutateSyncChallengeSubmissions>
>

/**
 * SWR mutation for {@link mutateSyncChallengeSubmissions} (`X-Course-Id` from Redux).
 */
export const useMutateSyncChallengeSubmissionSwrCore = () => {
    const keycloak = useKeycloakZustand()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncChallengeSubmissionsResult,
        Error,
        string,
        SyncSubmissionRequest
    >(
        "MUTATE_SYNC_CHALLENGE_SUBMISSIONS_SWR",
        async (_key, { arg }) => {
            if (!keycloak.authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSyncChallengeSubmissions({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
