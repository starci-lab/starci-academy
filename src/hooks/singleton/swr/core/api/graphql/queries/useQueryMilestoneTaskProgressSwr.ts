import { GraphQLHeadersKey, queryMilestoneTaskProgress } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

export const useQueryMilestoneTaskProgressSwrCore = () => {
    const course = useAppSelector((state) => state.course.entity)

    const swr = useSWR(
        course?.id ? ["QUERY_MILESTONE_TASK_PROGRESS_SWR", course.id] : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course ID not found")
            }

            const data = await queryMilestoneTaskProgress({
                request: {
                    courseId: course.id,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })

            if (!data || !data.data) {
                throw new Error("Failed to fetch milestone task progress")
            }

            return data.data
        },
    )

    return swr
}
