import {
    GraphQLHeadersKey,
    queryIncompleteChallengeSubmissionJobs,
} from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setIncompleteChallengeSubmissionJobs } from "@/redux/slices"
import useSWR from "swr"

/**
 * Fetches `incompleteChallengeSubmissionJobs` for the enrolled course using `X-Course-Id`,
 * then hydrates `state.job.incompleteChallengeSubmissionJobs`.
 */
export const useQueryIncompleteChallengeSubmissionJobsSwrCore = () => {
    const keycloak = useKeycloakZustand()
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && course?.id
            ? [
                "QUERY_INCOMPLETE_CHALLENGE_SUBMISSION_JOBS_SWR",
                course.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const { data } = await queryIncompleteChallengeSubmissionJobs({
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                getAccessToken,
                refreshAccessToken,
            })
            const envelope = data?.incompleteChallengeSubmissionJobs
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "Incomplete challenge submission jobs not found",
                )
            }
            dispatch(setIncompleteChallengeSubmissionJobs(inner.items))
            return inner
        },
    )
    return swr
}
