import useSWR from "swr"
import { useLocale } from "next-intl"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { queryJobPosting } from "@/modules/api/graphql/queries/query-job-posting"

/**
 * Backend exception code (envelope `error` = the exception's `name`) for a
 * display id that resolves to no posting. A genuine "no such posting" is a
 * not-found EMPTY state, not a transport error — the fetcher returns `null`
 * for it so the detail page can render its `notFound` empty branch instead of
 * the generic error+retry.
 */
const JOB_POSTING_NOT_FOUND_CODE = "JOB_POSTING_NOT_FOUND_EXCEPTION"

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
                // a genuine "no such posting" is an empty/not-found state, not an
                // error — return null so the detail page shows its notFound branch
                if (wrapped.error === JOB_POSTING_NOT_FOUND_CODE) {
                    return null
                }
                throw new Error(wrapped.error || wrapped.message || "Job posting not found")
            }

            return wrapped.data ?? null
        },
    )
}
