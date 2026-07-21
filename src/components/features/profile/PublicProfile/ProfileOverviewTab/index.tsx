"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ProfileJobReadiness } from "./ProfileJobReadiness"
import { OverviewCourses } from "./OverviewCourses"
import { OverviewContributions } from "./OverviewContributions"
import { OverviewChallengeSkills } from "./OverviewChallengeSkills"
import { OverviewCodeSkills } from "./OverviewCodeSkills"
import { useProfileUsername } from "../hooks/useProfileUsername"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileOverviewTab}. */
export type ProfileOverviewTabProps = WithClassNames<undefined>

/**
 * Overview-tab body of the public profile (UI 2.0): five labelled sections, each
 * a {@link LabeledCard} (title `Label` outside, content inside) with its data
 * states handled by `AsyncContent`:
 *  0. Job readiness — `ProfileJobReadiness` (headline recruiter signal, no course-scope).
 *  1. Joined courses — `OverviewCourses` (see-all → Activity tab).
 *  2. Contributions — `OverviewContributions` (heatmap + streak).
 *  3. Skills from challenges — `OverviewChallengeSkills` (see-all → Challenges tab).
 *  4. Skills from practice — `OverviewCodeSkills` (see-all → Skills tab).
 *
 * Identity (avatar/name/bio) lives in the sidebar hero, so it is not repeated
 * here. Each section self-fetches the viewed user, so the tab takes no data props.
 *
 * @param props - {@link ProfileOverviewTabProps}
 */
export const ProfileOverviewTab = ({
    className,
}: ProfileOverviewTabProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const username = useProfileUsername()
    // "see all" jumps: now real nested-route navigation (`/profile/<username>/
    // <tab>`) instead of a shared store — username is always resolved here (this
    // tab only ever mounts under the already-resolved `[username]` route).
    const goToTab = (tab: "activity" | "challenges" | "skills") => {
        if (!username) {
            return
        }
        const profile = pathConfig().locale(locale).profile(username)
        const target = tab === "activity"
            ? profile.activity().build()
            : tab === "challenges"
                ? profile.challenges().build()
                : profile.skills().build()
        router.push(target)
    }

    return (
        <div className={cn("flex min-w-0 flex-1 flex-col gap-6", className)}>
            {/* headline recruiter signal — per-track depth, no blended composite.
                Each section below now owns its own LabeledCard (frameless computed
                internally) so loading/empty/error states get a real Card instead of
                rendering bare under a hardcoded `frameless`. */}
            <ProfileJobReadiness
                label={t("jobReadiness.title")}
            />

            <OverviewCourses
                label={t("publicProfile.overview.courses")}
                onSeeMore={() => goToTab("activity")}
                seeMoreLabel={t("publicProfile.overview.seeMore")}
            />

            <LabeledCard
                label={t("publicProfile.contributions.heading")}
            >
                <OverviewContributions />
            </LabeledCard>

            {/* two skill cards side by side on desktop */}
            <div className="grid gap-6 @app-md:grid-cols-2">
                <OverviewChallengeSkills
                    label={t("publicProfile.overview.challengeSkills")}
                    onSeeMore={() => goToTab("challenges")}
                    seeMoreLabel={t("publicProfile.overview.seeMore")}
                    fillHeight
                />

                <OverviewCodeSkills
                    label={t("publicProfile.overview.codeSkills")}
                    onSeeMore={() => goToTab("skills")}
                    seeMoreLabel={t("publicProfile.overview.seeMore")}
                    fillHeight
                />
            </div>
        </div>
    )
}
