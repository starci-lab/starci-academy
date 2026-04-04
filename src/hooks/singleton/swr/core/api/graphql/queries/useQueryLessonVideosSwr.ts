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
    const course = useAppSelector((state) => state.course.entity)
    const module = useAppSelector((state) => state.module.entity)
    const pageNumber = useAppSelector(
        (state) => state.module.pageNumber,
    )
    const limit = useAppSelector(
        (state) => state.module.limit,
    )
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && course?.id && module?.id
            ? [
                "QUERY_LESSON_VIDEOS_SWR",
                module?.id,
                course?.id,
                enrolled,
                pageNumber,
                limit,
            ]
            : null,
        async () => {
            if (!module?.id || !course?.id) {
                throw new Error("Module or course id not found")
            }
            const data = await queryLessonVideos({
                request: {
                    moduleId: module.id,
                    filters: {
                        pageNumber,
                        limit,
                        sorts: defaultLessonVideosListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
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
