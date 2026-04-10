import {
    defaultSubmissionAttemptsListSorts,
    GraphQLHeadersKey,
    querySubmissionAttempts,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { 
    setSubmissionAttempts, 
    setSubmissionAttemptsCount 
} from "@/redux/slices"
/**
 * Lists submission requirements for the focused challenge (`challengeSubmissions`).
 * Runs when `challenge.id` (or loaded `challenge.entity.id`) and course context exist.
 */
export const useQuerySubmissionAttemptsSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const challengeSubmissionId = useAppSelector(
        (state) => state.challenge.challengeSubmissionId
    )
    const swr = useSWR(
        enrolled && course?.id && challengeSubmissionId
            ? [
                "QUERY_SUBMISSION_ATTEMPTS_SWR",
                challengeSubmissionId,
                course.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!course?.id || !challengeSubmissionId) {
                throw new Error("Course or challenge submission id not found")
            }
            const data = await querySubmissionAttempts({
                request: {
                    challengeSubmissionId,
                    filters: {
                        sorts: defaultSubmissionAttemptsListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                token,
            })
            const payload = data.data?.submissionAttempts?.data
            if (!payload) {
                throw new Error("Submission attempts not found")
            }   
            dispatch(setSubmissionAttempts(payload.data))
            dispatch(setSubmissionAttemptsCount(payload.count))
            return payload
        },
    )
    return swr
}
