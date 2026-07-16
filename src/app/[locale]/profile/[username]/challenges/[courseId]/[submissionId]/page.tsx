import React from "react"
import {
    ProfileChallengeSubmissionDetail,
} from "@/components/features/profile/PublicProfile/ProfileChallengesTab/ProfileChallengeSubmissionDetail"

/**
 * Route `/[locale]/profile/[username]/challenges/[courseId]/[submissionId]` —
 * the DETAIL tier of the challenges flow: one passed submission's header, its
 * submitted repo/docs link, and the AI feedback rubric from the passing attempt.
 * The shared profile shell (hero, tabs bar, loading/not-found/locked handling)
 * lives in the parent `layout.tsx`; this page only renders the panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-challenge-submission-detail"
            className="flex flex-col gap-6"
        >
            <ProfileChallengeSubmissionDetail />
        </div>
    )
}

export default Page
