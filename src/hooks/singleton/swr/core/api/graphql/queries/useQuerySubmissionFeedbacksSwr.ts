import {
    useFeedbackDetailsOverlayState,
    useKeycloak } from "@/hooks/singleton"
import { 
    defaultSubmissionFeedbacksListSorts, 
    GraphQLHeadersKey, 
    querySubmissionFeedbacks 
} from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { 
    setSubmissionFeedbacks, 
    setSubmissionFeedbacksCount 
} from "@/redux/slices"
import useSWR from "swr"

/**
 * Lists submission feedbacks for the focused challenge submission (`challengeSubmissions`).
import { defaultSubmissionFeedbacksListSorts } from "@/modules/api"
import { GraphQLHeadersKey } from "@/modules/api"
 * Runs when `challengeSubmission.id` and course context exist.
 */
export const useQuerySubmissionFeedbacksSwrCore = () => {
    const keycloak = useKeycloak()
    const getAccessToken = () =>
        keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.data?.updateToken(minValiditySeconds)) ?? false
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const { isOpen } = useFeedbackDetailsOverlayState()
    const submissionAttemptId = useAppSelector(
        (state) => state.submissionAttempt.id
    )
    const swr = useSWR(
        enrolled && course?.id && submissionAttemptId && isOpen
            ? [
                "QUERY_SUBMISSION_FEEDBACKS_SWR",
                submissionAttemptId,
                course.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!course?.id || !submissionAttemptId) {
                throw new Error("Course or submission attempt id not found")
            }
            const data = await querySubmissionFeedbacks({
                request: {
                    submissionAttemptId,
                    filters: {
                        sorts: defaultSubmissionFeedbacksListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                getAccessToken,
                refreshAccessToken,
            })
            const payload = data.data?.submissionFeedbacks?.data
            if (!payload) {
                throw new Error("Submission feedbacks not found")
            }   
            dispatch(setSubmissionFeedbacks(payload.data))
            dispatch(setSubmissionFeedbacksCount(payload.count))
            return payload
        },
    )
    return swr
}
