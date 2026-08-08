import {
    GoogleIcon,
    GithubIcon,
} from "@/components/svg"
import type { IconComponent } from "@/components/atoms/buttons/Button"
import { KeycloakIdentityProvider } from "@/modules/api/graphql/mutations/types/exchange-code-for-token"

/**
 * One OAuth shortcut button rendered above the credentials form.
 *
 * Mirrors a single identity-provider option (provider + icon + label key).
 */
export interface OauthButtonItem {
    /** OAuth identity provider sent to Keycloak. */
    provider: KeycloakIdentityProvider
    /** Icon component for the provider button. */
    icon: IconComponent
    /** Translation key for the button label. */
    labelKey: string
}

/**
 * Ordered catalog of OAuth shortcut buttons shown on the sign-in step.
 *
 * Static lookup: provider → icon + label key. Order drives render order
 * (Google first, GitHub second).
 */
export const OAUTH_BUTTON_ITEMS: Array<OauthButtonItem> = [
    {
        provider: KeycloakIdentityProvider.Google,
        icon: GoogleIcon,
        labelKey: "auth.signIn.google",
    },
    {
        provider: KeycloakIdentityProvider.Github,
        icon: GithubIcon,
        labelKey: "auth.signIn.github",
    },
]
