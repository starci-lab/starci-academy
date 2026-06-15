"use client"

import React from "react"
import {
    cn,
    Spinner,
    Tooltip,
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
        <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-6", className)}>
            {data.map((item) => {
                // earned → tier count / done; locked → progress toward threshold
                const status = item.earned
                    ? (item.tierReached
                        ? `×${item.tierReached}`
                        : t("dashboard.achievements.earned"))
                    : `${item.currentValue}/${item.threshold}`
                return (
                    <Tooltip
                        key={item.slug}
                        delay={200}
                    >
                        <Tooltip.Trigger>
                            <div className="flex cursor-default flex-col items-center gap-1.5 text-center">
                                {/* badge art (MinIO) → medal placeholder; dimmed when locked */}
                                <BadgeImage
                                    objectKey={item.iconKey}
                                    size={64}
                                    alt={item.name}
                                    className={cn(!item.earned && "opacity-40 grayscale")}
                                    fallback={(
                                        <MedalIcon
                                            width={64}
                                            height={64}
                                            className={cn(
                                                item.earned ? "text-warning" : "text-default-400",
                                            )}
                                        />
                                    )}
                                />
                                <div className="line-clamp-2 text-xs leading-tight text-foreground">
                                    {item.name}
                                </div>
                                <div className="text-[10px] text-muted">
                                    {status}
                                </div>
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            placement="top"
                            showArrow
                            className="max-w-[240px]"
                        >
                            <Tooltip.Arrow />
                            {/* hover card: big icon + name + how-to-earn + progress */}
                            <div className="flex flex-col items-center gap-1.5 p-1 text-center">
                                <BadgeImage
                                    objectKey={item.iconKey}
                                    size={72}
                                    alt={item.name}
                                    className={cn(!item.earned && "opacity-40 grayscale")}
                                    fallback={(
                                        <MedalIcon
                                            width={72}
                                            height={72}
                                            className={cn(
                                                item.earned ? "text-warning" : "text-default-400",
                                            )}
                                        />
                                    )}
                                />
                                <div className="text-sm font-semibold text-foreground">
                                    {item.name}
                                </div>
                                <div className="text-xs text-muted">
                                    {item.description}
                                </div>
                                <div className={cn(
                                    "text-xs font-medium",
                                    item.earned ? "text-success" : "text-foreground",
                                )}
                                >
                                    {status}
                                </div>
                            </div>
                        </Tooltip.Content>
                    </Tooltip>
                )
            })}
        </div>
    )
}
