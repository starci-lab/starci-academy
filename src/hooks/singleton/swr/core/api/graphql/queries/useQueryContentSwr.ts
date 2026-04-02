import { GraphQLHeadersKey, queryContent } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setContent } from "@/redux/slices"
/**
 * Singleton SWR for `content(request: { id })` — id from `content.id` (`setContentId`).
 */
export const useQueryContentSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const contentId = useAppSelector((state) => state.content.id)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        contentId && course?.id
            ? [
                "QUERY_CONTENT_SWR",
                contentId,
                course?.id,
            ]
            : null,
        async () => {
            if (!contentId || !course?.id) {
                throw new Error("Content or course id not found")
            }
            const data = await queryContent({
                request: { id: contentId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                token,
            })
            if (!data?.data?.content?.data) {
                throw new Error("Content not found")
            }
            dispatch(setContent(data.data.content.data))
            return data.data.content.data
        },
    )
    return swr
}
