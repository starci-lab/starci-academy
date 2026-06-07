
import useSWR from "swr"
import {
    GraphQLHeadersKey,
    queryMilestoneTask,
} from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedTaskDetail } from "@/redux/slices"
/**
 * Fetches one milestone task by `selectedTaskId` and hydrates `milestone.selectedTaskDetail` in Redux.
 * UI reads task fields from Redux; use `useQueryMilestoneTaskSwr` for loading/error only.
 */
export const useQueryMilestoneTaskSwr = () => {
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const swr = useSWR(
        authenticated && course?.id && selectedTaskId
            ? ["QUERY_MILESTONE_TASK_SWR", course.id, selectedTaskId]
            : null,
        async () => {
            if (!course?.id || !selectedTaskId) {
                throw new Error("Course ID or task ID not found")
            }

            const result = await queryMilestoneTask({
                request: { id: selectedTaskId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })

            const envelope = result.data?.task
            if (!envelope?.success || !envelope.data) {
                throw new Error(envelope?.error ?? envelope?.message ?? "Failed to fetch milestone task")
            }
            dispatch(setSelectedTaskDetail(envelope.data))
            return envelope.data
        },
    )

    return swr
}
