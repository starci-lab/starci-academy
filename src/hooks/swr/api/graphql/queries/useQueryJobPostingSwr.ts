import useSWR from "swr"
import { useLocale } from "next-intl"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { queryJobPosting } from "@/modules/api/graphql/queries/query-job-posting"

/**
 * SWR hook for one job posting's detail (`/jobs/[displayId]`). Public — works
 * for anonymous viewers. Null key suspends the fetch when `displayId` is empty.
 *
 * @param displayId - the posting's display id (route param).
 * @returns the SWR handle (`data` = the posting, undefined until resolved).
 */
export const useQueryJobPostingSwr = (displayId: string | undefined) => {
    const locale = useLocale()

    return useSWR(
        displayId ? ["QUERY_JOB_POSTING_SWR", locale, displayId] : null,
        async () => {
            const response = await queryJobPosting({
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
                request: { displayId: displayId as string },
            })

            const wrapped = response.data?.jobPosting
            if (!wrapped) {
                throw new Error("Job posting not found")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "Job posting not found")
            }

            return wrapped.data ?? null
        },
    )
}
