import useSWR from "swr"
import { queryUserSolvedChallengeDetail } from "@/modules/api/graphql/queries/query-user-solved-challenge-detail"

/**
 * SWR hook for the detail of ONE of a user's passed challenge submissions
 * (title, link, language, score, course, + structured AI feedback from the
 * passing attempt). Public. Pass null/undefined userId or submissionId to
 * disable.
 *
 * @param userId - id of the user (profile owner) whose solved-challenge detail to fetch
 * @param submissionId - the submission id (`user_challenge_submissions.id`) to fetch
 * @returns the SWR handle (data = the submission detail, or undefined until resolved)
 */
export const useQueryUserSolvedChallengeDetailSwr = (
    userId: string | null | undefined,
    submissionId: string | null | undefined,
) => {
    const swr = useSWR(
        userId && submissionId ? ["QUERY_USER_SOLVED_CHALLENGE_DETAIL_SWR", userId, submissionId] : null,
        async () => {
            const data = await queryUserSolvedChallengeDetail({
                request: {
                    userId: userId as string,
                    submissionId: submissionId as string,
                },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch user solved challenge detail")
            }
            return data.data.userSolvedChallengeDetail?.data ?? null
        },
    )
    return swr
}
