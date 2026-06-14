import useSWRInfinite from "swr/infinite"
import { queryMyFeed, MyFeedTab } from "@/modules/api"
import type { QueryMyFeedResponseData } from "@/modules/api"
import { useAppSelector } from "@/redux"

/** Items per feed page. */
const PAGE_LIMIT = 20

/**
 * Cursor-paginated SWR hook for the home feed (infinite scroll). Each page keys
 * off the previous page's `nextCursor`; returns `null` key to stop when the feed
 * is exhausted or the viewer is unauthenticated.
 *
 * @param tab - which feed (forYou | following)
 * @returns the SWRInfinite handle (data = array of pages, size, setSize, ...)
 */
export const useQueryMyFeedSwr = (tab: MyFeedTab) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const getKey = (
        index: number,
        previous: QueryMyFeedResponseData | null,
    ): readonly [string, MyFeedTab, string] | null => {
        // don't fetch when signed out
        if (!authenticated) {
            return null
        }
        // previous page had no next cursor → end of feed, stop
        if (previous && previous.nextCursor === null) {
            return null
        }
        // page 1 has no cursor; later pages use the previous page's nextCursor
        const cursor = index === 0 ? "" : previous?.nextCursor ?? ""
        return ["QUERY_MY_FEED_SWR", tab, cursor]
    }

    return useSWRInfinite(
        getKey,
        async ([, currentTab, cursor]) => {
            const data = await queryMyFeed({
                request: {
                    tab: currentTab,
                    cursor: cursor || undefined,
                    limit: PAGE_LIMIT,
                },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch feed")
            }
            return data.data.myFeed?.data ?? { items: [], nextCursor: null }
        },
    )
}
