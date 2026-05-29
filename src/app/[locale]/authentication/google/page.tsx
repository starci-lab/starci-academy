import React from "react"
import {
    OauthRedirect,
    OauthAction,
} from "@/components/layouts/auth"

/**
 * Route `/[locale]/authentication/google` — generic Google OAuth redirect landing
 * (adapter `init` hand-off) via Keycloak. Thin route file: only mounts the component.
 */
const Page = () => {
    return <OauthRedirect action={OauthAction.Authenticate} />
}

export default Page
