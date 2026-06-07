import { querySavedContents } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR query core for the saved/favorited contents query. User-scoped — only
 * runs once the viewer is authenticated.
 * @returns the SWR query handle.
 */
export const useQuerySavedContentsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    // SWR to fetch user saved contents, no params needed (it takes skip=0, take=20 by default for now)
    const swr = useSWR(
        authenticated ? ["QUERY_SAVED_CONTENTS_SWR"] : null,
        async () => {
            const data = await querySavedContents({
                request: {},
            })
            if (!data?.data?.savedContents?.data) {
                throw new Error("Failed to fetch saved contents")
            }
            return data.data.savedContents.data
        },
    )
    return swr
}
