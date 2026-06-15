"use client"

import React from "react"
import {
    cn,
    Spinner,
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
    useProfileUsername,
} from "../useProfileUsername"
import {
    BadgeImage,
} from "@/components/reuseable/BadgeImage"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileAchievements}. */
export type ProfileAchievementsProps = WithClassNames<undefined>

/**
 * Achievements tab of the public profile — the profile owner's badge wall. Earned
 * badges show in full colour; locked ones are dimmed with progress toward the
 * threshold. Self-contained container: reads the target user id from the route
 * and drives its own SWR. Mirrors the dashboard achievements grid but for any
 * user (not just the viewer). Badge art comes from MinIO (`iconKey`), falling
 * back to a medal placeholder.
 *
 * @param props - optional className for the root element.
 */
export const ProfileAchievements = ({
    className,
}: ProfileAchievementsProps) => {
    const t = useTranslations()
    // route carries the username; resolve it to the entity id the achievements
    // query keys off (the profile fetch is SWR-deduped with the parent + tabs)
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserAchievementsSwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // no definitions / nothing earned to surface → empty state
    if (!data || data.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                {t("publicProfile.achievementsEmpty")}
            </div>
        )
    }

    return (
        <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-6", className)}>
            {data.map((item) => (
                <div
                    key={item.slug}
                    title={`${item.name} — ${item.description}`}
                    className="flex flex-col items-center gap-1.5 text-center"
                >
                    {/* badge art (MinIO) → medal placeholder; dimmed when locked */}
                    <BadgeImage
                        objectKey={item.iconKey}
                        size={48}
                        alt={item.name}
                        className={cn(!item.earned && "opacity-40 grayscale")}
                        fallback={(
                            <MedalIcon
                                width={48}
                                height={48}
                                className={cn(
                                    item.earned ? "text-warning" : "text-default-400",
                                )}
                            />
                        )}
                    />
                    <div className="line-clamp-2 text-[11px] leading-tight text-foreground">
                        {item.name}
                    </div>
                    {/* earned → tier count / done; locked → progress toward threshold */}
                    <div className="text-[10px] text-muted">
                        {item.earned
                            ? (item.tierReached
                                ? `×${item.tierReached}`
                                : t("dashboard.achievements.earned"))
                            : `${item.currentValue}/${item.threshold}`}
                    </div>
                </div>
            ))}
        </div>
    )
}
