import { GraphQLHeadersKey, queryModules } from "@/modules/api"
import { useAppSelector, useAppDispatch } from "@/redux"
import { setModules } from "@/redux/slices"
import useSWR from "swr"

/**
 * Lists all modules for the current course via `modules` ES query.
 * Dispatches `setModules` into the module redux slice.
 */
export const useQueryModulesSwrCore = () => {
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()

    const swr = useSWR(
        enrolled && course?.id ? ["QUERY_MODULES_SWR", course.id, enrolled] : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course ID not found")
            }

            const data = await queryModules({
                request: {
                    courseId: course.id,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })

            if (!data || !data.data) {
                throw new Error("Failed to fetch modules")
            }

            if (data.data.modules?.data?.data) {
                dispatch(setModules(data.data.modules.data.data))
            }

            return data.data
        },
    )

    return swr
}
