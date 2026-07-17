import useSWR from "swr"
import { queryCourseMindMap } from "@/modules/api/graphql/queries/query-course-mind-map"
import type { CourseMindMapData } from "@/modules/api/graphql/queries/types"

/**
 * Loads the course mind-map graph — the AUTHORED concept tree (keywords + cross-links) when the
 * course has one seeded, otherwise the server's derived course→module→lesson graph.
 *
 * Keyed on the course slug/id: a nullish id yields a null key, so SWR makes no request. The graph
 * is structural (server-cached with a long TTL), so it is safe to keep between navigations.
 *
 * @param courseId - The course mount slug (displayId) or raw id; null to skip.
 * @returns SWR result whose `data` is the graph payload, or undefined while loading.
 */
export const useQueryCourseMindMapSwr = (courseId: string | null) => {
    return useSWR<CourseMindMapData>(
        courseId
            ? [
                "QUERY_COURSE_MIND_MAP_SWR",
                courseId,
            ]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const result = await queryCourseMindMap({
                request: {
                    courseId,
                },
            })
            const data = result?.data?.courseMindMap?.data
            if (!data) {
                throw new Error("Course mind-map not found")
            }
            return data
        },
    )
}
