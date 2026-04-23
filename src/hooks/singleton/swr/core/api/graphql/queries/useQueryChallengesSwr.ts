import {
    GraphQLHeadersKey,
    queryChallenges,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { ContentTab, setChallengeCount, setChallenges } from "@/redux/slices"
/**
 * Lists module challenges via `challenges` and merges into `course.module.challenges`.
 */
export const useQueryChallengesSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const content = useAppSelector((state) => state.content.entity)
    const pageNumber = useAppSelector(
        (state) => state.module.pageNumber,
    )
    const limit = useAppSelector(
        (state) => state.module.limit,
    )
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const dispatch = useAppDispatch()
    return useSWR(
        enrolled && course?.id && content?.id && contentTab === ContentTab.Challenges
            ? [
                "QUERY_CHALLENGES_SWR",
                content?.id,
                course?.id,
                enrolled,
                pageNumber,
                limit,
                contentTab,
            ]
            : null,
        async () => {
            if (!content?.id || !course?.id) {
                throw new Error("Content or course id not found")
            }
            const data = await queryChallenges({
                request: {
                    contentId: content.id,
                    filters: {
                        pageNumber,
                        limit,
                        sorts: [],
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                token,
            })
            const payload = data.data?.challenges?.data
            if (!payload) {
                throw new Error("Challenges not found")
            }
            dispatch(setChallenges(payload.data))
            dispatch(setChallengeCount(payload.count))
            return payload
        },
    )
}
