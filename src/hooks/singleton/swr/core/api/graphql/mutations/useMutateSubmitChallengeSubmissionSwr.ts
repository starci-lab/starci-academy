import { useKeycloakZustand } from "@/hooks/zustand"
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
    const keycloak = useKeycloakZustand()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    const swr = useSWRMutation<
        MutateSubmitChallengeSubmissionResult,
        Error,
        string,
        SubmitChallengeSubmissionRequest
    >(
        "MUTATE_SUBMIT_CHALLENGE_SUBMISSION_SWR",
        async (_key, { arg }) => {
            if (!keycloak.authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSubmitChallengeSubmission({
                request: arg,
                getAccessToken,
                refreshAccessToken,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
