import { GraphQLHeadersKey, queryMilestones } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setMilestones } from "@/redux/slices"
import useSWR from "swr"

/**
 * Core SWR hook to fetch milestones for the current course.
 */
export const useQueryMilestonesSwrCore = () => {
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const swr = useSWR(
        course?.id ? [
            "QUERY_MILESTONES_SWR",
            course?.id,
        ] : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const data = await queryMilestones({
                request: {
                    courseId: course?.id,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
                },
            })
            if (!data || !data.data) {
                throw new Error("Milestones not found")
            }
            /** Store milestones in Redux. */
            dispatch(setMilestones(data.data.milestones.data ?? []))
            return data.data
        })
    return swr
}
