
import {
    mutateSignOut,
} from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"
import { setAuthenticated, setUser } from "@/redux/slices"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
/**
 * SWR mutation for {@link mutateSignOut} (`X-Course-Id` from Redux).
 */
export const useMutateSignOutSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const dispatch = useAppDispatch()
    const swr = useSWRMutation(
        "MUTATE_SIGN_OUT_SWR",
        async () => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            await mutateSignOut({
                request: undefined,
            })
            LocalStorage.removeItem(LocalStorageId.KeycloakAccessToken)
            dispatch(setUser(null))
            dispatch(setAuthenticated(false))
        },
    )
    return swr
}
