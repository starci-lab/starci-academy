import React from "react"
import {
    PublicProfile,
} from "@/components/features/profile/PublicProfile"

/**
 * Layout for `/[locale]/profile/[username]` and its tab routes (`overview`
 * [bare], `projects`, `challenges`, `skills`, `activity` — `cv` stays on the
 * separate, always-own `/profile/cv` route). Wraps every tab's page in the
 * shared {@link PublicProfile} shell (hero + tabs-bar registration + loading /
 * not-found / locked handling), computed ONCE here instead of per tab. Mirrors
 * the `/profile/settings` layout → `SettingsLayout` pattern.
 */
const Layout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <PublicProfile>
            {children}
        </PublicProfile>
    )
}

export default Layout
