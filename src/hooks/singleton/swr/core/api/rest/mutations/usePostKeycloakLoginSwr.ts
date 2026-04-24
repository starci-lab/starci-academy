import {
    keycloakLogin,
    type KeycloakLoginRequest,
    type KeycloakLoginResponse,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

/**
 * SWR mutation wrapper for {@link keycloakLogin}.
 */
export const usePostKeycloakLoginSwrCore = () => {
    const swr = useSWRMutation<
        KeycloakLoginResponse,
        Error,
        string,
        KeycloakLoginRequest
    >(
        "POST_KEYCLOAK_LOGIN_SWR",
        async (_key, { arg }) => {
            return keycloakLogin(arg)
        }
    )
    return swr
}
