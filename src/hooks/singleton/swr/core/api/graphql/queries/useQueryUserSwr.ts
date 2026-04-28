import { queryMe } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setAuthenticated, setUser } from "@/redux/slices"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
/**
 * The core function to query courses with SWR.
 */
export const useQueryUserSwrCore = () => {
    const dispatch = useAppDispatch()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    /** The SWR. */
    const swr = useSWR(
        ["QUERY_USER_SWR", authenticated.toString()],
        async () => {
            if (
                !LocalStorage.getItemAsString(
                    LocalStorageId.KeycloakAccessToken
                )) {
                return
            }
            /** The data. */
            const data = await queryMe(
                { 
                    debug: true,
                }
            )
            if (!data || !data.data || !data.data.me.data) {
                throw new Error("User not found")
            }
            /** Set the user. */
            dispatch(setAuthenticated(true))
            dispatch(setUser(data.data.me.data))
            /** Return the data. */
            return data.data
        }
    )
    /** Return the SWR. */
    return swr
}
