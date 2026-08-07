"use client"

import React from "react"
import {
    ProfileCoding,
} from "./ProfileCoding"
import {
    ProfileSectionGuard,
} from "@/components/blocks/profile/ProfileSectionGuard"

/** Props for {@link ProfileSkillsPage}. */
export type ProfileSkillsPageProps = Record<string, never>
/**
 * Skills tab ("Skills & Coding") of the public profile — a sibling of the
 * Challenges tab. Delegates the whole tab to {@link ProfileCoding}, which leads
 * with the headline metric row, gathers the breakdowns into one "Stats" card, and
 * lists the solve history. Self-contained: it reads the username from the route,
 * drives its own SWR, and self-hides each block when there is nothing to show.
 *
 * @param props - optional className for the root element.
 */
export const ProfileSkillsPage = () => {
    return (
        <ProfileSectionGuard section="skills">
            <div className={"flex flex-col gap-6"}>
                {/* metric row → gathered stats card → solve history */}
                <ProfileCoding />
            </div>
        </ProfileSectionGuard>
    )
}
