import React from "react"
import { SettingsLayout } from "@/components/layouts/SettingsLayout"

/**
 * Layout for the `/[locale]/profile/settings` group — every private
 * account-management page sits inside the shared settings sidebar shell.
 */
const Layout = ({ children }: { children: React.ReactNode }) => (
    <SettingsLayout>{children}</SettingsLayout>
)

export default Layout
