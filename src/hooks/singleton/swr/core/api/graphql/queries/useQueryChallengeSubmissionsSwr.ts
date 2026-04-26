import {
    defaultChallengeSubmissionsSorts,
    GraphQLHeadersKey,
    queryChallengeSubmissions,
} from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setChallengeSubmissions } from "@/redux/slices"

/**
 * Lists submission requirements for the focused challenge (`challengeSubmissions`).
 * Runs when `challenge.id` (or loaded `challenge.entity.id`) and course context exist.
 */
export const useQueryChallengeSubmissionsSwrCore = () => {
    const keycloak = useKeycloakZustand()
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const course = useAppSelector((state) => state.course.entity)
    const challengeId = useAppSelector(
        (state) => state.challenge.id
    )
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && course?.id && challengeId
            ? [
                "QUERY_CHALLENGE_SUBMISSIONS_SWR",
                challengeId,
                course.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!course?.id || !challengeId) {
                throw new Error("Course or challenge id not found")
            }
            const data = await queryChallengeSubmissions({
                request: {
                    challengeId,
                    filters: {
                        sorts: defaultChallengeSubmissionsSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
                getAccessToken,
                refreshAccessToken,
            })
            const payload = data.data?.challengeSubmissions?.data
            if (!payload) {
                throw new Error("Challenge submissions not found")
            }
            dispatch(setChallengeSubmissions(payload.data))
            return payload
        },
    )
    return swr
}
