import React from "react"
import {
    ProfileChallengeManage,
} from "@/components/features/profile/PublicProfile/ProfileChallengesTab/ProfileChallengeManage"

/**
 * Route `/[locale]/profile/[username]/challenges/[courseId]` — the MANAGE tier
 * of the challenges flow: search / filter / sort ONE course's passed-challenge
 * submissions. The shared profile shell (hero, tabs bar, loading/not-found/locked
 * handling) lives in the parent `layout.tsx`; this page only renders the panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-challenge-manage"
            className="flex flex-col gap-6"
        >
            <ProfileChallengeManage />
        </div>
    )
}

export default Page
