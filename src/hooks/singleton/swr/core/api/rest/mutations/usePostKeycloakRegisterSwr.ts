import {
    keycloakRegister,
    type KeycloakRegisterRequest,
    type KeycloakRegisterResponse,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

/**
 * SWR mutation wrapper for {@link keycloakRegister}.
 */
export const usePostKeycloakRegisterSwrCore = () => {
    const swr = useSWRMutation<
        KeycloakRegisterResponse,
        Error,
        string,
        KeycloakRegisterRequest
    >(
        "POST_KEYCLOAK_REGISTER_SWR",
        async (_key, { arg }) => {
            return keycloakRegister(arg)
        }
    )
    return swr
}
