"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Medal as MedalIcon,
} from "@gravity-ui/icons"
import {
    useQueryUserAchievementsSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    BadgeImage,
} from "@/components/reuseable/BadgeImage"
import {
    useProfileUsername,
} from "../useProfileUsername"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfilePinned}. */
export type ProfilePinnedProps = WithClassNames<undefined>

/** Max earned badges shown in the Overview pinned strip. */
const MAX_PINNED = 12

/**
 * Overview "pinned" strip — the profile owner's earned achievement badges, a
 * compact highlight above the contribution heatmap (like GitHub's pinned items).
 * Self-contained container: reads the username from the route, resolves it to the
 * entity id, and reuses the achievements query (SWR-deduped with the Achievements
 * tab). Renders nothing when the user has earned no badges yet.
 *
 * @param props - optional className for the root element.
 */
export const ProfilePinned = ({
    className,
}: ProfilePinnedProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data } = useQueryUserAchievementsSwr(userId)

    // only the earned badges, capped — the full wall lives in the Achievements tab
    const earned = (data ?? []).filter((achievement) => achievement.earned).slice(0, MAX_PINNED)
    // nothing earned yet → no pinned strip at all
    if (earned.length === 0) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-3 rounded-large border border-default/40 p-5", className)}>
            <div className="text-sm font-semibold text-foreground">
                {t("publicProfile.pinnedAchievements")}
            </div>
            <div className="flex flex-wrap gap-3">
                {earned.map((item) => (
                    <BadgeImage
                        key={item.slug}
                        objectKey={item.iconKey}
                        size={40}
                        alt={item.name}
                        fallback={(
                            <MedalIcon
                                width={40}
                                height={40}
                                className="text-warning"
                            />
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
