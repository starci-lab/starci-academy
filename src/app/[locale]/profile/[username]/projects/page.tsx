import React from "react"
import {
    ProfileProjectsTab,
} from "@/components/features/profile/PublicProfile/ProfileProjectsTab"

/**
 * Route `/[locale]/profile/[username]/projects` — the "Projects" tab (verified
 * capstone work) of the public profile. The shared shell (hero, tabs bar,
 * loading/not-found/locked handling) lives in the parent `layout.tsx`; this page
 * only renders the tab's own panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-projects"
            role="tabpanel"
            aria-labelledby="projects"
            className="flex flex-col gap-6"
        >
            <ProfileProjectsTab />
        </div>
    )
}

export default Page
