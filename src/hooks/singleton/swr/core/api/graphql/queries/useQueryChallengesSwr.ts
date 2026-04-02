import {
    GraphQLHeadersKey,
    defaultChallengesListSorts,
    defaultModuleListLimit,
    queryChallenges,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { mergeModuleLearnData } from "@/redux/slices"

/**
 * Lists module challenges via `challenges` and merges into `course.module.challenges`.
 */
export const useQueryChallengesSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const modulePk = useAppSelector((state) => state.course.module?.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId && modulePk
            ? [
                "QUERY_CHALLENGES_SWR",
                modulePk,
                courseId,
                enrolled,
            ]
            : null,
        async () => {
            if (!modulePk || !courseId) {
                throw new Error("Module or course id not found")
            }
            const data = await queryChallenges({
                request: {
                    filters: {
                        moduleId: modulePk,
                        pageNumber: 0,
                        limit: defaultModuleListLimit,
                        sorts: defaultChallengesListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            const payload = data.data?.challenges?.data
            if (!payload) {
                throw new Error("Challenges not found")
            }
            dispatch(mergeModuleLearnData({ challenges: payload.data }))
            return payload
        },
    )
    return swr
}
