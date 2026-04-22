import { useKeycloak } from "@/hooks/singleton"
import {
    GraphQLHeadersKey,
    mutateSubmitChallengeSubmission,
    type SubmitChallengeSubmissionRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSubmitChallengeSubmissionResult = Awaited<
    ReturnType<typeof mutateSubmitChallengeSubmission>
>
/**
 * SWR mutation for {@link mutateSubmitChallengeSubmission} (`X-Course-Id` from Redux).
 */
export const useMutateSubmitChallengeSubmissionSwrCore = () => {
    const keycloak = useKeycloak()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSubmitChallengeSubmissionResult,
        Error,
        string,
        SubmitChallengeSubmissionRequest
    >(
        "MUTATE_SUBMIT_CHALLENGE_SUBMISSION_SWR",
        async (_key, { arg }) => {
            const token = keycloak.data?.token
            if (!token) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSubmitChallengeSubmission({
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
