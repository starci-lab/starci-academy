import {
    GraphQLHeadersKey,
    queryChallenges,
} from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setChallengeCount, setChallenges } from "@/redux/slices"
/**
 * Lists module challenges via `challenges` and merges into `course.module.challenges`.
 */
export const useQueryChallengesSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
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
    const swr = useSWR(
        enrolled && course?.id && module?.id
            ? [
                "QUERY_CHALLENGES_SWR",
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
            const data = await queryChallenges({
                request: {
                    moduleId: module.id,
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
    return swr
}
