import { useKeycloak } from "@/hooks/singleton"
import {
    GraphQLHeadersKey,
    mutateSyncChallengeSubmissionUrls,
    type SyncSubmissionUrlsRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSyncChallengeSubmissionUrlsResult = Awaited<
    ReturnType<typeof mutateSyncChallengeSubmissionUrls>
>

/**
 * SWR mutation for {@link mutateSyncChallengeSubmissionUrls} (`X-Course-Id` from Redux).
 */
export const useMutateSyncChallengeSubmissionUrlsSwrCore = () => {
    const keycloak = useKeycloak()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncChallengeSubmissionUrlsResult,
        Error,
        string,
        SyncSubmissionUrlsRequest
    >(
        "MUTATE_SYNC_CHALLENGE_SUBMISSION_URLS_SWR",
        async (_key, { arg }) => {
            const token = keycloak.data?.token
            if (!token) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSyncChallengeSubmissionUrls({
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
