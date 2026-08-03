import React from "react"
import {
    PublicProfileLayout,
} from "@/components/layoutsv2/PublicProfileLayout"

/**
 * Layout for `/[locale]/profile/[username]` and its tab routes (`overview`
 * [bare], `projects`, `challenges`, `skills`, `activity` — `cv` stays on the
 * separate, always-own `/profile/cv` route). Wraps every tab's page in the
 * v2 {@link PublicProfileLayout} shell (hero + inline tabs strip + loading /
 * not-found / locked handling), computed ONCE here instead of per tab. Mirrors
 * the `/profile/settings` layout → `SettingsLayout` pattern.
 *
 * Ported from the v1 `PublicProfile` shell — same `{ children }`-only prop
 * shape, so no prop adaptation was needed at this call site. Two known
 * behaviour changes come from the v2 component itself (see its own file
 * header / TODOs), not from this wiring: the tab strip now renders inline as
 * chrome above the body instead of registering into the Navbar's bottom
 * layer, and `rank`/`badges` do not render (no equivalent field on
 * `UserEntity` yet — `src/components/layoutsv2/PublicProfileLayout/map.ts`).
 */
const Layout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <PublicProfileLayout>
            {children}
        </PublicProfileLayout>
    )
}

export default Layout
