import { GraphQLHeadersKey, queryChallenge } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setChallenge } from "@/redux/slices"

/**
 * Singleton SWR for `challenge(request: { id })` — id from `challenge.id` (`setChallengeId`).
 */
export const useQueryChallengeSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const challengeId = useAppSelector((state) => state.challenge.id)
    const course = useAppSelector((state) => state.course.entity)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const dispatch = useAppDispatch()
    console.log(
        `enrolled && challengeId && course?.id: ${enrolled} && ${challengeId} && ${course?.id}`,
    )
    const swr = useSWR(
        enrolled && challengeId && course?.id
            ? [
                "QUERY_CHALLENGE_SWR",
                challengeId,
                course?.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!challengeId || !course?.id) {
                throw new Error("Challenge or course id not found")
            }
            const data = await queryChallenge({
                request: { id: challengeId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                token,
            })
            if (!data?.data?.challenge?.data) {
                throw new Error("Challenge not found")
            }
            dispatch(setChallenge(data.data.challenge.data))
            return data.data.challenge.data
        },
    )
    return swr
}
