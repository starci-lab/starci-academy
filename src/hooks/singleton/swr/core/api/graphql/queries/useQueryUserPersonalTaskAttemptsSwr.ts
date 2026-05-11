import {
    defaultUserPersonalTaskAttemptsListSorts,
    GraphQLHeadersKey,
    queryUserPersonalTaskAttempts,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR hook for querying paginated user personal task attempts
 * for the currently selected milestone task.
 */
export const useQueryUserPersonalTaskAttemptsSwrCore = () => {
    const course = useAppSelector((state) => state.course.entity)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const swr = useSWR(
        authenticated && course?.id && selectedTaskId
            ? ["QUERY_USER_PERSONAL_TASK_ATTEMPTS_SWR", course.id, selectedTaskId]
            : null,
        async () => {
            if (!course?.id || !selectedTaskId) {
                throw new Error("Course ID or Task ID not found")
            }

            const data = await queryUserPersonalTaskAttempts({
                request: {
                    courseId: course.id,
                    taskId: selectedTaskId,
                    filters: {
                        sorts: defaultUserPersonalTaskAttemptsListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })

            const payload = data.data?.userPersonalTaskAttempts?.data
            if (!payload) {
                throw new Error("Failed to fetch personal task attempts")
            }

            return payload
        },
    )

    return swr
}
