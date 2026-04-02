import { GraphQLHeadersKey, queryChallenge } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * Singleton SWR for `challenge(request: { id })` — id from `course.detailChallengeId` (`setDetailChallengeId`).
 */
export const useQueryChallengeSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const challengeId = useAppSelector((state) => state.course.detailChallengeId)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const swr = useSWR(
        challengeId && courseId
            ? [
                "QUERY_CHALLENGE_SWR",
                challengeId,
                courseId,
            ]
            : null,
        async () => {
            if (!challengeId || !courseId) {
                throw new Error("Challenge or course id not found")
            }
            const data = await queryChallenge({
                request: { id: challengeId },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            if (!data?.data?.challenge?.data) {
                throw new Error("Challenge not found")
            }
            return data.data.challenge.data
        },
    )
    return swr
}
