import {
    GraphQLHeadersKey,
    defaultLessonVideosListSorts,
    queryLessonVideos,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setLessonVideos } from "@/redux/slices"

/**
 * Lists module lesson videos via `lessonVideos` and merges into `course.module.lessonVideos`.
 */
export const useQueryLessonVideosSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.id)
    const moduleId = useAppSelector((state) => state.module.id)
    const pageNumber = useAppSelector(
        (state) => state.module.pageNumber,
    )
    const limit = useAppSelector(
        (state) => state.module.limit,
    )
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId && moduleId
            ? [
                "QUERY_LESSON_VIDEOS_SWR",
                moduleId,
                courseId,
                enrolled,
                pageNumber,
                limit,
            ]
            : null,
        async () => {
            if (!moduleId || !courseId) {
                throw new Error("Module or course id not found")
            }
            const data = await queryLessonVideos({
                request: {
                    filters: {
                        moduleId,
                        pageNumber,
                        limit,
                        sorts: defaultLessonVideosListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            const payload = data.data?.lessonVideos?.data
            if (!payload) {
                throw new Error("Lesson videos not found")
            }
            dispatch(setLessonVideos(payload.data))
            return payload
        },
    )
    return swr
}
