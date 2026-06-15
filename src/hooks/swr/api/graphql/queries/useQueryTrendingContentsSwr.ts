import { queryTrendingContents } from "@/modules/api"
import type { QueryTrendingContentItemData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryTrendingContents}. `data` is the lessons read most
 * across the platform this week (most-read first), or `[]`. User-scoped — only
 * runs once authenticated.
 */
export const useQueryTrendingContentsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<Array<QueryTrendingContentItemData>>(
        authenticated ? ["QUERY_TRENDING_CONTENTS_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; empty list when absent
            const result = await queryTrendingContents({})
            return result.data?.trendingContents?.data ?? []
        },
    )
}
