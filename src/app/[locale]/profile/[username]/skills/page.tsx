import React from "react"
import {
    ProfileSkillsTab,
} from "@/components/features/profile/PublicProfile/ProfileSkillsTab"

/**
 * Route `/[locale]/profile/[username]/skills` — the "Skills" tab
 * (coding-practice / judge stats) of the public profile. The shared shell (hero,
 * tabs bar, loading/not-found/locked handling) lives in the parent `layout.tsx`;
 * this page only renders the tab's own panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-skills"
            role="tabpanel"
            aria-labelledby="skills"
            className="flex flex-col gap-6"
        >
            <ProfileSkillsTab />
        </div>
    )
}

export default Page
