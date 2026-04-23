import { queryMe } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch } from "@/redux"
import useSWR from "swr"
import { setUser } from "@/redux/slices"
/**
 * The core function to query courses with SWR.
 */
export const useQueryUserSwrCore = () => {
    const keycloak = useKeycloak()
    const dispatch = useAppDispatch()
    const getAccessToken = () =>
        keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.data?.updateToken(minValiditySeconds)) ?? false
    /** The SWR. */
    const swr = useSWR(
        keycloak.data?.authenticated ? ["QUERY_USER_SWR"] : null,
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
