import React from "react"
import {
    OauthRedirect,
    OauthAction,
} from "@/components/layouts/auth"

/**
 * Route `/[locale]/authentication/google/login` — OAuth redirect landing after
 * a Google sign-in via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirect action={OauthAction.Login} />
}

export default Page
