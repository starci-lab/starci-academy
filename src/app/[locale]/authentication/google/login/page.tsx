import React from "react"
import { OauthRedirectPage } from "@/components/pages/OauthRedirectPage"
import { OauthAction } from "@/components/pages/OauthRedirectPage/enums/oauth-action"

/**
 * Route `/[locale]/authentication/google/login` — OAuth redirect landing after
 * a Google sign-in via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirectPage action={OauthAction.Login} />
}

export default Page
