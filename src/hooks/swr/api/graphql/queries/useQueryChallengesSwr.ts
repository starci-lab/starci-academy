import {
    GraphQLHeadersKey,
    queryChallenges,
} from "@/modules/api"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    useParams,
} from "next/navigation"
import useSWR from "swr"
import {
    ContentTab,
    setChallengeCount,
    setChallenges,
} from "@/redux/slices"

/**
 * Lists challenges for the active lesson (`challenges` query).
 *
 * Keys use URL `[contentId]` (with Redux fallback) like {@link useQueryContentSwr} so navigation
 * refetches immediately. Redux mirroring stays in the fetcher; stale lists are cleared in
 * {@link useSyncReduxContentId} when `content.id` changes.
 */
export const useQueryChallengesSwr = () => {
    const params = useParams()
    const routeContentId = params.contentId as string | undefined
    const reduxContentId = useAppSelector((state) => state.content.id)
    const contentId = routeContentId ?? reduxContentId
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const pageNumber = useAppSelector((state) => state.challenge.pageNumber)
    const limit = useAppSelector((state) => state.challenge.limit)
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const dispatch = useAppDispatch()
    return useSWR(
        authenticated
            && enrolled
            && course?.id
            && contentId
            && contentTab === ContentTab.Challenges
            ? [
                "QUERY_CHALLENGES_SWR",
                contentId,
                course.id,
                enrolled,
                authenticated,
                pageNumber,
                limit,
                contentTab,
            ]
            : null,
        async () => {
            if (!contentId || !course?.id) {
                throw new Error("Content or course id not found")
            }
            const data = await queryChallenges({
                request: {
                    contentId,
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
        {
            /** New content id → do not show the previous lesson's challenges while loading. */
            keepPreviousData: false,
        },
    )
}
