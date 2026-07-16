import React from "react"
import { OauthRedirect } from "@/components/features/auth/OauthRedirect"
import { OauthAction } from "@/components/features/auth/OauthRedirect/enums/oauth-action"

/**
 * Route `/[locale]/authentication/google/logout` — OAuth redirect landing after
 * a Google sign-out via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirect action={OauthAction.Logout} />
}

export default Page
