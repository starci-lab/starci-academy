import { KeycloakIdentityProvider } from "@/modules/api"

/**
 * Session storage oauth idp hint provider.
 */
export interface SessionStorageOauthIdpHint {
    provider: KeycloakIdentityProvider
}