import React from "react"
import {
    ProfileChallengesTab,
} from "@/components/features/profile/PublicProfile/ProfileChallengesTab"

/**
 * Route `/[locale]/profile/[username]/challenges` — the "Challenges" tab
 * (graded-challenge repo proof) of the public profile. The shared shell (hero,
 * tabs bar, loading/not-found/locked handling) lives in the parent `layout.tsx`;
 * this page only renders the tab's own panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-challenges"
            role="tabpanel"
            aria-labelledby="challenges"
            className="flex flex-col gap-6"
        >
            <ProfileChallengesTab />
        </div>
    )
}

export default Page
