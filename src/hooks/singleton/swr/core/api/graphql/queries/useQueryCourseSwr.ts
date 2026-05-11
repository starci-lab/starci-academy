import { queryCourse } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setCourse } from "@/redux/slices"
import useSWR from "swr"

/**
 * The core function to query courses with SWR.
 */
export const useQueryCourseSwrCore = () => {
    const dispatch = useAppDispatch()
    const id = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    const swr = useSWR(
        (id || displayId) ? [
            "QUERY_COURSE_SWR",
            id,
            displayId,
        ] : null, 
        async () => {
            if (!id && !displayId) {
                throw new Error("Course id not found")
            }
            const data = await queryCourse(
                { 
                    request: {
                        id,
                        displayId,
                    }
                }
            )
            if (!data || !data.data) {
                throw new Error("Course not found")
            }
            dispatch(setCourse(data.data.course.data))
            return data.data
        })
    return swr
}
