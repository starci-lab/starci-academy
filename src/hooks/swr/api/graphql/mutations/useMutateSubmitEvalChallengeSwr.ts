
import {
    GraphQLHeadersKey,
    mutateSubmitEvalChallenge,
    type SubmitEvalChallengeInput,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSubmitEvalChallengeResult = Awaited<
    ReturnType<typeof mutateSubmitEvalChallenge>
>
/**
 * SWR mutation for {@link mutateSubmitEvalChallenge} (`X-Course-Id` from Redux,
 * required by the MustEnrolled guard).
 */
export const useMutateSubmitEvalChallengeSwr = () => {
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWRMutation<
        MutateSubmitEvalChallengeResult,
        Error,
        string,
        SubmitEvalChallengeInput
    >(
        "MUTATE_SUBMIT_EVAL_CHALLENGE_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSubmitEvalChallenge({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
