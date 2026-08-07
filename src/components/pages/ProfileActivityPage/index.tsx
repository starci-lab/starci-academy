"use client"

import React from "react"
import {
    ProfileAchievements,
} from "./ProfileAchievements"
import {
    ProfileActivity,
} from "./ProfileActivity"
import {
    ProfileSectionGuard,
} from "@/components/blocks/profile/ProfileSectionGuard"

/** Props for {@link ProfileActivityPage}. */
export type ProfileActivityPageProps = Record<string, never>
/**
 * "Activity" tab of the public profile (NEW-PROFILE.spec.md §7.4). A single
 * centered column with two editorial sections — earned achievements (badge wall
 * by tier/rank) then the activity timeline. Courses live in the Overview tab, so
 * they are not repeated here. A thin composition: each section is its own
 * self-fetching `LabeledCard` that self-hides when empty, so this wrapper only
 * stacks them with the `gap-6` vertical rhythm.
 *
 * @param props - {@link ProfileActivityPageProps}
 */
export const ProfileActivityPage = () => {
    return (
        <ProfileSectionGuard section="activity">
            <div className={"flex flex-col gap-6"}>
                <ProfileAchievements />
                <ProfileActivity />
            </div>
        </ProfileSectionGuard>
    )
}
