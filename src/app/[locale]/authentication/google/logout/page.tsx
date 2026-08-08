import React from "react"
import { OauthRedirectPage } from "@/components/pages/OauthRedirectPage"
import { OauthAction } from "@/modules/types/enums/oauth-action"

/**
 * Route `/[locale]/authentication/google/logout` — OAuth redirect landing after
 * a Google sign-out via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirectPage action={OauthAction.Logout} />
}

export default Page
