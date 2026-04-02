import { GraphQLHeadersKey, queryContent } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * Singleton SWR for `content(request: { id })` — id from `course.detailContentId` (`setDetailContentId`).
 */
export const useQueryContentSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const contentId = useAppSelector((state) => state.course.detailContentId)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const swr = useSWR(
        contentId && courseId
            ? [
                "QUERY_CONTENT_SWR",
                contentId,
                courseId,
            ]
            : null,
        async () => {
            if (!contentId || !courseId) {
                throw new Error("Content or course id not found")
            }
            const data = await queryContent({
                request: { id: contentId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            if (!data?.data?.content?.data) {
                throw new Error("Content not found")
            }
            return data.data.content.data
        },
    )
    return swr
}
