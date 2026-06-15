import { queryChangelogEntries } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryChangelogEntries}. `data` is the recent
 * published changelog entries for the dashboard right rail. Global content —
 * runs unconditionally.
 */
export const useQueryChangelogEntriesSwr = () => {
    return useSWR(
        ["QUERY_CHANGELOG_ENTRIES_SWR"],
        async () => {
            const data = await queryChangelogEntries({})
            return data.data?.changelogEntries?.data ?? []
        },
    )
}
