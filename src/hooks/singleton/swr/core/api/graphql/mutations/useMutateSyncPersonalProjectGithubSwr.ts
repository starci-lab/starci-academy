import {
    GraphQLHeadersKey,
    mutateSyncPersonalProjectGithub,
    type SyncPersonalProjectGithubRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSyncPersonalProjectGithubResult = Awaited<
    ReturnType<typeof mutateSyncPersonalProjectGithub>
>

/**
 * SWR mutation for {@link mutateSyncPersonalProjectGithub} (`X-Course-Id` from Redux).
 */
export const useMutateSyncPersonalProjectGithubSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncPersonalProjectGithubResult,
        Error,
        string,
        SyncPersonalProjectGithubRequest
    >(
        "MUTATE_SYNC_PERSONAL_PROJECT_GITHUB_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSyncPersonalProjectGithub({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
