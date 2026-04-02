import {
    GraphQLHeadersKey,
    defaultLessonVideosListSorts,
    defaultModuleListLimit,
    queryLessonVideos,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { mergeModuleLearnData } from "@/redux/slices"

/**
 * Lists module lesson videos via `lessonVideos` and merges into `course.module.lessonVideos`.
 */
export const useQueryLessonVideosSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const modulePk = useAppSelector((state) => state.course.module?.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId && modulePk
            ? [
                "QUERY_LESSON_VIDEOS_SWR",
                modulePk,
                courseId,
                enrolled,
            ]
            : null,
        async () => {
            if (!modulePk || !courseId) {
                throw new Error("Module or course id not found")
            }
            const data = await queryLessonVideos({
                request: {
                    filters: {
                        moduleId: modulePk,
                        pageNumber: 0,
                        limit: defaultModuleListLimit,
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
            dispatch(mergeModuleLearnData({ lessonVideos: payload.data }))
            return payload
        },
    )
    return swr
}
