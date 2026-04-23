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
    const displayId = useAppSelector((state) => state.content.displayId)
    const module = useAppSelector((state) => state.module.entity)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        displayId && module?.id
            ? [
                "QUERY_CONTENT_SWR",
                displayId,
                module?.id,
                course?.id,
            ]
            : null,
        async () => {
            if (!displayId || !module?.id) {
                throw new Error("Content or course id not found")
            }
            const data = await queryContent({
                request: { displayId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
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
