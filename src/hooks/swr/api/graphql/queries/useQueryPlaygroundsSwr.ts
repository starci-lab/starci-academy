import useSWR from "swr"
import { queryPlaygrounds } from "@/modules/api/graphql/queries/playground"
import { useAppSelector } from "@/redux/hooks"

/**
 * Lists the Playground exercises available for the active course (the hub
 * list). Gated on `course.id` being resolved (same pattern as
 * {@link import("./useQueryCourseEnrollmentStatusSwr").useQueryCourseEnrollmentStatusSwr}).
 */
export const useQueryPlaygroundsSwr = () => {
    const courseId = useAppSelector((state) => state.course.id)
    const swr = useSWR(
        courseId
            ? [
                "QUERY_PLAYGROUNDS_SWR",
                courseId,
            ]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const data = await queryPlaygrounds({
                request: { courseId },
            })
            return data.data?.playgrounds.data ?? []
        },
    )
    return swr
}
