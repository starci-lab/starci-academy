import type React from "react"
import type {
    KeycloakIdentityProvider,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types"

/**
 * One OAuth shortcut button rendered above the credentials form.
 *
 * Mirrors a single identity-provider option (provider + icon + label key).
 */
export interface OauthButtonItem {
    /** OAuth identity provider sent to Keycloak. */
    provider: KeycloakIdentityProvider
    /** Icon component for the provider button. */
    icon: React.ComponentType<WithClassNames<undefined>>
    /** Translation key for the button label. */
    labelKey: string
}
