"use client"

import React from "react"
import {
    ProfileChallenges,
} from "./ProfileChallenges"
import {
    ProfileSectionGuard,
} from "@/components/blocks/profile/ProfileSectionGuard"

/** Props for {@link ProfileChallengesPage}. */
export type ProfileChallengesPageProps = Record<string, never>
/**
 * "Challenges" tab of the public profile (SKILLS-TABS-UX-BRAINSTORM.md §4) — the
 * proof-first, recruiter-facing view of graded-challenge work: a passed count, a
 * language-breadth bar, and the submission list (each row links out to the
 * submitted repo). The single section self-fetches the viewed user, so the tab
 * takes no data props; single centered column, vertical rhythm `gap-6`.
 *
 * @param props - {@link ProfileChallengesPageProps}
 */
export const ProfileChallengesPage = () => {
    return (
        <ProfileSectionGuard section="challenges">
            <div className={"flex min-w-0 flex-col gap-6"}>
                <ProfileChallenges />
            </div>
        </ProfileSectionGuard>
    )
}
