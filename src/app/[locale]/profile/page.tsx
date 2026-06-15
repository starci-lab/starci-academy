import React from "react"
import {
    PublicProfile,
} from "@/components/layouts/profile/PublicProfile"

/**
 * Route `/[locale]/profile` — the signed-in user's own profile, rendered with the
 * same GitHub-style layout as any public profile. PublicProfile resolves the
 * username from the signed-in user on this bare route, and shows the "edit" action
 * for the owner. Settings live under the `/profile/*` sub-pages (edit, sessions,
 * security, …), reached from the account menu — there is no separate hub anymore.
 */
const Page = () => {
    return <PublicProfile />
}

export default Page
