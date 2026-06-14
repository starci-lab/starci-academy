import {
    mutateGradeInterviewAnswer,
    type GradeInterviewAnswerRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateGradeInterviewAnswerResult = Awaited<
    ReturnType<typeof mutateGradeInterviewAnswer>
>

/**
 * SWR mutation for {@link mutateGradeInterviewAnswer}. Grading is stateless and
 * only requires an authenticated user (no enrollment), so no `X-Course-Id`
 * header is sent — just guard on the Keycloak session.
 */
export const useMutateGradeInterviewAnswerSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWRMutation<
        MutateGradeInterviewAnswerResult,
        Error,
        string,
        GradeInterviewAnswerRequest
    >(
        "MUTATE_GRADE_INTERVIEW_ANSWER_SWR",
        async (_key, { arg }) => {
            // grading is gated by the Keycloak session only — fail fast when signed out
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateGradeInterviewAnswer({
                request: arg,
            })
        },
    )
    return swr
}
