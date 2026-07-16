import useSWR from "swr"
import { queryUserCodingProblemDetail } from "@/modules/api/graphql/queries/query-user-coding-problem-detail"

/**
 * SWR hook for one coding problem's detail (statement, tags, sample testcases,
 * starter code) plus a target user's accepted-submission summary for it — backs
 * `/profile/<username>/skills/<slug>`. Public (gated by the profile's visibility,
 * same as `userCodingHistory`). Pass null/undefined userId/slug to disable.
 *
 * @param userId - id of the profile owner (target user) whose submission summary to fetch
 * @param slug - stable URL slug of the coding problem
 * @returns the SWR handle (data = `{ problem, submission }`, or undefined until resolved)
 */
export const useQueryUserCodingProblemDetailSwr = (
    userId: string | null | undefined,
    slug: string | null | undefined,
) => {
    const swr = useSWR(
        userId && slug ? ["QUERY_USER_CODING_PROBLEM_DETAIL_SWR", userId, slug] : null,
        async () => {
            const data = await queryUserCodingProblemDetail({
                request: {
                    userId: userId as string,
                    slug: slug as string,
                },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch user coding problem detail")
            }
            return data.data.userCodingProblemDetail?.data ?? null
        },
    )
    return swr
}
