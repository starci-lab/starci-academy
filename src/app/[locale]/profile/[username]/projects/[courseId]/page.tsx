import React from "react"
import {
    ProfileProjectRoadmap,
} from "@/components/features/profile/PublicProfile/ProfileProjectsTab/ProfileProjectRoadmap"

/**
 * Route `/[locale]/profile/[username]/projects/[courseId]` — the DETAIL tier of
 * the projects flow: the FULL milestone/task roadmap of ONE capstone course
 * (no inline expand cap, unlike the list's compact card). The shared profile
 * shell (hero, tabs bar, loading/not-found/locked handling) lives in the parent
 * `layout.tsx`; this page only renders the panel.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-project-roadmap"
            className="flex flex-col gap-6"
        >
            <ProfileProjectRoadmap />
        </div>
    )
}

export default Page
