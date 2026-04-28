import {
    GraphQLHeadersKey,
    queryChallenges,
} from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { ContentTab, setChallengeCount, setChallenges } from "@/redux/slices"
/**
 * Lists module challenges via `challenges` and merges into `course.module.challenges`.
 */
export const useQueryChallengesSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
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
        authenticated && enrolled && course?.id && content?.id && contentTab === ContentTab.Challenges
            ? [
                "QUERY_CHALLENGES_SWR",
                content?.id,
                course?.id,
                enrolled,
                authenticated,
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
