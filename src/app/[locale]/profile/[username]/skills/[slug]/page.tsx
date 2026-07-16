import React from "react"
import {
    ProfileCodingProblemDetail,
} from "@/components/features/profile/PublicProfile/ProfileSkillsTab/ProfileCodingProblemDetail"

/**
 * Route `/[locale]/profile/[username]/skills/[slug]` — the DETAIL tier of the
 * skills (coding) flow: one solved coding problem's statement plus the profile
 * owner's accepted-submission summary. The shared profile shell (hero, tabs bar,
 * loading/not-found/locked handling) lives in the parent `layout.tsx`; this page
 * only renders the panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-coding-problem-detail"
            className="flex flex-col gap-6"
        >
            <ProfileCodingProblemDetail />
        </div>
    )
}

export default Page
