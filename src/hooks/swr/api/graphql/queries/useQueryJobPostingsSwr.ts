import useSWR from "swr"
import { useLocale } from "next-intl"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { defaultJobPostingsLimit, queryJobPostings } from "@/modules/api/graphql/queries/query-job-postings"
import type { JobPostingsRequest } from "@/modules/api/graphql/queries/types/job-postings"

/** Parameters accepted by {@link useQueryJobPostingsSwr}. */
export type UseQueryJobPostingsSwrParams = Omit<JobPostingsRequest, "limit" | "offset"> & {
    /** Page size; defaults to {@link defaultJobPostingsLimit}. */
    limit?: number
    /** Rows to skip (offset pagination); defaults to 0. */
    offset?: number
}

/**
 * SWR hook for the job board list (`/jobs`). Public — works for anonymous
 * viewers. Re-fetches whenever the filters/page change (all part of the key).
 *
 * @param params - filters + pagination; see {@link UseQueryJobPostingsSwrParams}.
 * @returns the SWR handle (`data` = `{ items, total }`, undefined while loading).
 */
export const useQueryJobPostingsSwr = (params: UseQueryJobPostingsSwrParams = {}) => {
    const locale = useLocale()
    const {
        limit = defaultJobPostingsLimit,
        offset = 0,
        workMode,
        employmentType,
        search,
    } = params

    return useSWR(
        [
            "QUERY_JOB_POSTINGS_SWR",
            locale,
            limit,
            offset,
            workMode ?? "",
            employmentType ?? "",
            search ?? "",
        ],
        async () => {
            const response = await queryJobPostings({
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
                request: {
                    limit,
                    offset,
                    workMode,
                    employmentType,
                    search: search?.trim() ? search.trim() : undefined,
                },
            })

            const wrapped = response.data?.jobPostings
            if (!wrapped) {
                throw new Error("Job postings not found")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "Job postings not found")
            }

            return wrapped.data ?? { items: [], total: 0 }
        },
        {
            keepPreviousData: true,
        },
    )
}
