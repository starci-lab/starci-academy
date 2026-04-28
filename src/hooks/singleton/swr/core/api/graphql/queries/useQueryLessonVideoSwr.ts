import { GraphQLHeadersKey, queryLessonVideo } from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setLessonVideo } from "@/redux/slices"
/**
 * Singleton SWR for `lessonVideo(request: { id })` — id from `lessonVideo.id` (`setLessonVideoId`).
 */
export const useQueryLessonVideoSwrCore = () => {
    const keycloak = useKeycloakZustand()
    const lessonVideoId = useAppSelector((state) => state.lessonVideo.id)
    const courseId = useAppSelector((state) => state.course.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        lessonVideoId && courseId
            ? [
                "QUERY_LESSON_VIDEO_SWR",
                lessonVideoId,
                courseId,
            ]
            : null,
        async () => {
            if (!lessonVideoId || !courseId) {
                throw new Error("Lesson video or course id not found")
            }
            const data = await queryLessonVideo({
                request: { id: lessonVideoId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
            if (!data?.data?.lessonVideo?.data) {
                throw new Error("Lesson video not found")
            }
            dispatch(setLessonVideo(data.data.lessonVideo.data))
            return data.data.lessonVideo.data
        },
    )
    return swr
}
