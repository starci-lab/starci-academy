import React from "react"
import { OauthRedirectPage } from "@/components/pages/OauthRedirectPage"
import { OauthAction } from "@/components/pages/OauthRedirectPage/enums/oauth-action"

/**
 * Route `/[locale]/authentication/github/login` — OAuth redirect landing after
 * a GitHub sign-in via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirectPage action={OauthAction.Login} />
}

export default Page
