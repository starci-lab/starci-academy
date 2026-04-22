import {
    GraphQLHeadersKey,
    queryIncompleteChallengeSubmissionJobs,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * Fetches `incompleteChallengeSubmissionJobs` for the enrolled course using `X-Course-Id`.
 */
export const useQueryIncompleteChallengeSubmissionJobsSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const swr = useSWR(
        enrolled && course?.id
            ? [
                "QUERY_INCOMPLETE_CHALLENGE_SUBMISSION_JOBS_SWR",
            ]
            : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const apollo = await queryIncompleteChallengeSubmissionJobs({
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                token,
            })
            const envelope = apollo.data?.incompleteChallengeSubmissionJobs
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "Incomplete challenge submission jobs not found",
                )
            }
            return inner
        },
    )
    return swr
}
