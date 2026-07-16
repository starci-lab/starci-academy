import React from "react"
import {
    ProfileActivityTab,
} from "@/components/features/profile/PublicProfile/ProfileActivityTab"

/**
 * Route `/[locale]/profile/[username]/activity` — the "Activity" tab
 * (achievements, joined courses, timeline) of the public profile. The shared
 * shell (hero, tabs bar, loading/not-found/locked handling) lives in the parent
 * `layout.tsx`; this page only renders the tab's own panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-activity"
            role="tabpanel"
            aria-labelledby="activity"
            className="flex flex-col gap-6"
        >
            <ProfileActivityTab />
        </div>
    )
}

export default Page
