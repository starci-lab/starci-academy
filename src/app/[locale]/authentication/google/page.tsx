import React from "react"
import { OauthRedirectPage } from "@/components/pages/OauthRedirectPage"
import { OauthAction } from "@/components/pages/OauthRedirectPage/enums/oauth-action"

/**
 * Route `/[locale]/authentication/google` — generic Google OAuth redirect landing
 * (adapter `init` hand-off) via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirectPage action={OauthAction.Authenticate} />
}

export default Page
