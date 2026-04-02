import {
    GraphQLHeadersKey,
    defaultContentsListSorts,
    defaultModuleListLimit,
    queryContents,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { mergeModuleLearnData } from "@/redux/slices"

/**
 * Lists module contents via `contents` and merges rows into `course.module.contents`.
 */
export const useQueryContentsSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const modulePk = useAppSelector((state) => state.course.module?.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId && modulePk
            ? [
                "QUERY_CONTENTS_SWR",
                modulePk,
                courseId,
                enrolled,
            ]
            : null,
        async () => {
            if (!modulePk || !courseId) {
                throw new Error("Module or course id not found")
            }
            const data = await queryContents({
                request: {
                    filters: {
                        moduleId: modulePk,
                        pageNumber: 0,
                        limit: defaultModuleListLimit,
                        sorts: defaultContentsListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            const payload = data.data?.contents?.data
            if (!payload) {
                throw new Error("Contents not found")
            }
            dispatch(mergeModuleLearnData({ contents: payload.data }))
            return payload
        },
    )
    return swr
}
