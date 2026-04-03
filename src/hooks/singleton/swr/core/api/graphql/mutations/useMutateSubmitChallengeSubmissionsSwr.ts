import { useKeycloak } from "@/hooks/singleton"
import {
    GraphQLHeadersKey,
    mutateSubmitChallengeSubmissions,
    type SubmitChallengeSubmissionsRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSubmitChallengeSubmissionsResult = Awaited<
    ReturnType<typeof mutateSubmitChallengeSubmissions>
>

/**
 * SWR mutation for {@link mutateSubmitChallengeSubmissions} (`X-Course-Id` from Redux).
 */
export const useMutateSubmitChallengeSubmissionsSwrCore = () => {
    const keycloak = useKeycloak()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSubmitChallengeSubmissionsResult,
        Error,
        string,
        SubmitChallengeSubmissionsRequest
    >(
        "MUTATE_SUBMIT_CHALLENGE_SUBMISSIONS_SWR",
        async (_key, { arg }) => {
            const token = keycloak.data?.token
            if (!token) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSubmitChallengeSubmissions({
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
