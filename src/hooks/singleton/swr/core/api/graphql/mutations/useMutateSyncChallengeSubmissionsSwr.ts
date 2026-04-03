import { useKeycloak } from "@/hooks/singleton"
import {
    GraphQLHeadersKey,
    mutateSyncChallengeSubmissions,
    type SyncSubmissionsRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSyncChallengeSubmissionsResult = Awaited<
    ReturnType<typeof mutateSyncChallengeSubmissions>
>

/**
 * SWR mutation for {@link mutateSyncChallengeSubmissions} (`X-Course-Id` from Redux).
 */
export const useMutateSyncChallengeSubmissionsSwrCore = () => {
    const keycloak = useKeycloak()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncChallengeSubmissionsResult,
        Error,
        string,
        SyncSubmissionsRequest
    >(
        "MUTATE_SYNC_CHALLENGE_SUBMISSIONS_SWR",
        async (_key, { arg }) => {
            const token = keycloak.data?.token
            if (!token) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSyncChallengeSubmissions({
                variables: {
                    request: arg,
                },
                token,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
