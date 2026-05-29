import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for Keycloak login.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const usePostKeycloakLoginSwr = () => {
    const { postKeycloakLoginSwr } = use(SwrContext)!
    return postKeycloakLoginSwr
}
