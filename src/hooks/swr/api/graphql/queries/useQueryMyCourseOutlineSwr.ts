import { queryMyCourseOutline } from "@/modules/api"
import type { MyCourseOutlinePayload } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryMyCourseOutline}. Fetches the signed-in viewer's
 * full outline (module/lesson/challenge + milestone/task trees with progress
 * overlaid) for one enrolled course. `data` is the outline payload or `undefined`
 * while loading.
 *
 * Keyed on the raw `courseId`: a `null` id yields a `null` key, so SWR makes no
 * request (e.g. before a course is selected). User-scoped — only runs once the
 * viewer is authenticated.
 *
 * @param courseId - The RAW course entity id (decode a `globalId` with
 *   `fromGlobalId`), or `null` to skip fetching.
 */
export const useQueryMyCourseOutlineSwr = (courseId: string | null) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyCourseOutlinePayload>(
        authenticated && courseId
            ? ["QUERY_MY_COURSE_OUTLINE_SWR", courseId]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const result = await queryMyCourseOutline({
                request: {
                    courseId,
                },
            })
            const payload = result.data?.myCourseOutline?.data
            if (!payload) {
                throw new Error("Course outline not found")
            }
            return payload
        },
    )
}
