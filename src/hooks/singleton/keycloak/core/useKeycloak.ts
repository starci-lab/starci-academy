import { createKeycloak } from "@/modules/keycloak"
import useSWR from "swr"
import { pathConfig } from "@/resources/path"

/**
 * Keycloak client via SWR — single fetch for the app lifecycle.
 */
export const useKeycloakCore = () => {
    return useSWR(
        "KEYCLOAK_SWR",
        async () => {
            const keycloak = createKeycloak()
            await keycloak.init({
                onLoad: "check-sso",
                silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
                responseMode: "query",
                pkceMethod: "S256",
                redirectUri: `${window.location.origin}${pathConfig().locale().authentication().google().login().build()}`,
            })
            return keycloak
        }
    )
}