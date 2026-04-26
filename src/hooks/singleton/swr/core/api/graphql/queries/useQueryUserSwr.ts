import { queryMe } from "@/modules/api"
import { useAppDispatch } from "@/redux"
import useSWR from "swr"
import { setUser } from "@/redux/slices"
import { useKeycloakZustand } from "@/hooks/zustand"
/**
 * The core function to query courses with SWR.
 */
export const useQueryUserSwrCore = () => {
    const { authenticated, token, updateToken } = useKeycloakZustand()
    const dispatch = useAppDispatch()
    const getAccessToken = () =>
        authenticated ? token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await updateToken(minValiditySeconds)) ?? false
    /** The SWR. */
    const swr = useSWR(
        authenticated ? ["QUERY_USER_SWR"] : null,
        async () => {
            /** The data. */
            const data = await queryMe(
                { 
                    getAccessToken,
                    refreshAccessToken,
                }
            )
            if (!data || !data.data || !data.data.me.data) {
                throw new Error("User not found")
            }
            /** Set the user. */
            dispatch(setUser(data.data.me.data))
            /** Return the data. */
            return data.data
        })
    /** Return the SWR. */
    return swr
}
