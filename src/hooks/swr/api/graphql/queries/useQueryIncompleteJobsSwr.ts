import {
    GraphQLHeadersKey,
    queryIncompleteJobs,
} from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setIncompleteJobs } from "@/redux/slices"
import useSWR from "swr"

/**
 * Fetches incomplete jobs for the enrolled course using `X-Course-Id`,
 * then hydrates `state.job.incompleteJobs` from the GraphQL field `incompletedJobs`.
 */
export const useQueryIncompleteJobsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        authenticated && enrolled && course?.id
            ? [
                "QUERY_INCOMPLETE_JOBS_SWR",
                course.id,
                enrolled,
                authenticated,
            ]
            : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const { data } = await queryIncompleteJobs({
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })
            const envelope = data?.incompletedJobs
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "Incomplete jobs not found",
                )
            }
            dispatch(setIncompleteJobs(inner.items))
            return inner
        },
    )
    return swr
}
