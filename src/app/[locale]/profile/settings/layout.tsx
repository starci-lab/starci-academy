import React from "react"
import { SettingsLayout } from "@/components/layouts/SettingsLayout"

/** Props for the profile settings group layout. */
interface ProfileSettingsLayoutProps {
    /** Nested settings page content. */
    children: React.ReactNode
}

/**
 * Layout for the `/[locale]/profile/settings` group — every private
 * account-management page sits inside the shared settings sidebar shell.
 */
const Layout = ({ children }: ProfileSettingsLayoutProps) => (
    <SettingsLayout>{children}</SettingsLayout>
)

export default Layout
