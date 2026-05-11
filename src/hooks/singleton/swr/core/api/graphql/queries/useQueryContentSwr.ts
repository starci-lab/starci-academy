import { GraphQLHeadersKey, queryContent } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setContent } from "@/redux/slices"
/**
 * Singleton SWR for `content(request: { id })` — id from `content.id` (`setContentId`).
 */
export const useQueryContentSwrCore = () => {
    const id = useAppSelector((state) => state.content.id)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const moduleId = useAppSelector((state) => state.module.id)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        authenticated && id && moduleId && course?.id
            ? [
                "QUERY_CONTENT_SWR",
                id,
                moduleId,
                course?.id,
                authenticated,
            ]
            : null,
        async () => {
            if (!id || !moduleId) {
                throw new Error("Content or module id not found")
            }
            const data = await queryContent({
                request: { id },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
                },
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
