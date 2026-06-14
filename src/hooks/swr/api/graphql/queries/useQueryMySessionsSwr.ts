import { queryMySessions } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryMySessions}. `data` is the unwrapped array
 * of active device sessions (or `[]` when absent). User-scoped — only runs once
 * the viewer is authenticated.
 */
export const useQueryMySessionsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_MY_SESSIONS_SWR"] : null,
        async () => {
            const data = await queryMySessions({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch sessions")
            }

            return data.data.mySessions?.data?.data ?? []
        },
    )

    return swr
}
