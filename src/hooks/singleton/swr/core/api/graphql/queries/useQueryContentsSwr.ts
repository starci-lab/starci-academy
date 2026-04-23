import {
    GraphQLHeadersKey,  
    queryContents,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setContents, setContentsCount } from "@/redux/slices"

/**
 * Lists module contents via `contents` and merges rows into `course.module.contents`.
 */
export const useQueryContentsSwrCore = () => {
    const keycloak = useKeycloak()
    const getAccessToken = () =>
        keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.data?.updateToken(minValiditySeconds)) ?? false
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
    return useSWR(
        enrolled && course?.id && module?.id
            ? [
                "QUERY_CONTENTS_SWR",
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
            const data = await queryContents({
                request: {
                    moduleId: module?.id,
                    filters: {
                        pageNumber,
                        limit,
                        sorts: [],
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
                },
                getAccessToken,
                refreshAccessToken,
            })
            const payload = data.data?.contents?.data
            if (!payload) {
                throw new Error("Contents not found")
            }
            dispatch(setContents(payload.data))
            dispatch(setContentsCount(payload.count))
            return payload
        }
    )
}
