import React from "react"
import { ProfilePrivacySettings } from "@/components/features/profile/PrivacySettings"

/**
 * Route `/[locale]/profile/settings/privacy` — renders the privacy settings feature.
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <ProfilePrivacySettings />
}

export default Page
