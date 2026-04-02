import { GraphQLHeadersKey, queryLessonVideo } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * Singleton SWR for `lessonVideo(request: { id })` — id from `course.detailLessonVideoId` (`setDetailLessonVideoId`).
 */
export const useQueryLessonVideoSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const lessonVideoId = useAppSelector((state) => state.course.detailLessonVideoId)
    const courseId = useAppSelector((state) => state.course.course?.id)
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
                token,
            })
            if (!data?.data?.lessonVideo?.data) {
                throw new Error("Lesson video not found")
            }
            return data.data.lessonVideo.data
        },
    )
    return swr
}
