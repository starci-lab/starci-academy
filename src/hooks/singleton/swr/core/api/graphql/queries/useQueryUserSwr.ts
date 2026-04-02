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
    /** The SWR. */
    const swr = useSWR(
        keycloak.data?.authenticated ? ["QUERY_USER_SWR"] : null,
        async () => {
            /** The data. */
            const data = await queryMe(
                { 
                    token: keycloak.data?.token,
                }
            )
            if (!data || !data.data || !data.data.me.data) {
                throw new Error("User not found")
            }
            /** Set the user. */
            dispatch(setUser(data.data.me.data.data))
            /** Return the data. */
            return data.data
        })
    /** Return the SWR. */
    return swr
}
