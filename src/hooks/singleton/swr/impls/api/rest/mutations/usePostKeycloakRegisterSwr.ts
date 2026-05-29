import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for Keycloak registration.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const usePostKeycloakRegisterSwr = () => {
    const { postKeycloakRegisterSwr } = use(SwrContext)!
    return postKeycloakRegisterSwr
}
