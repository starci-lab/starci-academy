import React from "react"
import { PublicProfileLayout } from "@/components/layouts/PublicProfileLayout"

/**
 * Layout for `/[locale]/profile/[username]` and its tab routes (overview [bare],
 * projects, challenges, skills, activity — `cv` stays on its own `/profile/cv`
 * route). The hero, the tab strip and the loading / not-found / locked branches
 * are computed ONCE here rather than per tab.
 */
const Layout = ({ children }: { children: React.ReactNode }) => (
    <PublicProfileLayout>{children}</PublicProfileLayout>
)

export default Layout
