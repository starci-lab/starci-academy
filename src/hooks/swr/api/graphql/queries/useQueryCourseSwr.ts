import { queryCourse } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setCourse } from "@/redux/slices"
import useSWR from "swr"

/**
 * Loads course by URL `displayId` slug; hydrates Redux with entity including internal `id`.
 */
export const useQueryCourseSwr = () => {
    const dispatch = useAppDispatch()
    const displayId = useAppSelector((state) => state.course.displayId)
    const swr = useSWR(
        displayId
            ? [
                "QUERY_COURSE_SWR",
                displayId,
            ]
            : null,
        async () => {
            if (!displayId) {
                throw new Error("Course displayId not found")
            }
            const data = await queryCourse({
                request: {
                    displayId,
                },
            })
            if (!data?.data?.course?.data) {
                throw new Error("Course not found")
            }
            const course = data.data.course.data
            dispatch(setCourse(course))
            return data.data
        },
    )
    return swr
}
