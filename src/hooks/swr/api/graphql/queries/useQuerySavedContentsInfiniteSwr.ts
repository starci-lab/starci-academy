import useSWRInfinite from "swr/infinite"
import { querySavedContents } from "@/modules/api"
import type { SavedContentsData } from "@/modules/api"
import { useAppSelector } from "@/redux"

/** Saved-content rows per page (offset pagination). */
export const SAVED_CONTENTS_PAGE_LIMIT = 12

/**
 * Infinite (offset-paginated) SWR hook for the viewer's saved / favorited
 * contents — the "Đã lưu" page list. Each page is `savedContents(skip,take)`
 * (skip = pageIndex × {@link SAVED_CONTENTS_PAGE_LIMIT}); stops once a page comes
 * back shorter than a full page. User-scoped — keyed `null` (no fetch) until the
 * viewer is authenticated. Per the async rule, pagination uses `useSWRInfinite`
 * (never manual offset state).
 *
 * @returns the SWRInfinite handle (`data` = array of pages, `size`, `setSize`, …).
 */
export const useQuerySavedContentsInfiniteSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const getKey = (
        index: number,
        previous: SavedContentsData | null,
    ): readonly [string, number] | null => {
        if (!authenticated) {
            return null
        }
        // previous page shorter than a full page → end of the list, stop
        if (previous && previous.contents.length < SAVED_CONTENTS_PAGE_LIMIT) {
            return null
        }
        return ["QUERY_SAVED_CONTENTS_INFINITE_SWR", index]
    }

    return useSWRInfinite(
        getKey,
        async ([, index]) => {
            const data = await querySavedContents({
                request: {
                    skip: index * SAVED_CONTENTS_PAGE_LIMIT,
                    take: SAVED_CONTENTS_PAGE_LIMIT,
                },
            })
            const payload = data?.data?.savedContents?.data
            if (!payload) {
                throw new Error("Failed to fetch saved contents")
            }
            return payload
        },
    )
}
