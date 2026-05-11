import { GraphQLHeadersKey, queryMilestones } from "@/modules/api"
import { useAppSelector, useAppDispatch } from "@/redux"
import { setMilestones } from "@/redux/slices"
import useSWR from "swr"

export const useQueryMilestonesSwrCore = () => {
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()

    const swr = useSWR(
        course?.id ? ["QUERY_MILESTONES_SWR", course.id] : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course ID not found")
            }

            const data = await queryMilestones({
                request: {
                    courseId: course.id,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })

            if (!data || !data.data) {
                throw new Error("Failed to fetch milestones")
            }

            if (data.data.milestones?.data?.data) {
                dispatch(setMilestones(data.data.milestones.data.data))
            }

            return data.data
        },
    )

    return swr
}
