import {
    GraphQLHeadersKey,
    defaultLivestreamSessionsListSorts,
    queryLivestreamSessions,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import {
    setLivestreamSessions,
    setLivestreamSessionsCount,
} from "@/redux/slices"

/**
 * Lists course livestream sessions via `livestreamSessions` (enrolled + course id).
 */
export const useQueryLivestreamSessionsSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const pageNumber = useAppSelector((state) => state.livestreamSession.pageNumber)
    const limit = useAppSelector((state) => state.livestreamSession.limit)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId
            ? [
                "QUERY_LIVESTREAM_SESSIONS_SWR",
                courseId,
                enrolled,
                pageNumber,
                limit,
            ]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const data = await queryLivestreamSessions({
                request: {
                    courseId,
                    filters: {
                        pageNumber,
                        limit,
                        sorts: defaultLivestreamSessionsListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            const payload = data.data?.livestreamSessions?.data
            if (!payload) {
                throw new Error("Livestream sessions not found")
            }
            dispatch(setLivestreamSessions(payload.data))
            dispatch(setLivestreamSessionsCount(payload.count))
            return payload
        },
    )
    return swr
}
