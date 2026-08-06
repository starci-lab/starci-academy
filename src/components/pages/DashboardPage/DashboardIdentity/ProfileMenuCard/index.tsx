"use client"

import React, {
    useMemo,
} from "react"
import {
    CaretRightIcon,
} from "@phosphor-icons/react"
import {
    cn,
} from "@heroui/react"
import Link from "next/link"
import {
    useLocale,
} from "next-intl"
import {
    UserAvatar,
} from "@/components/blocks/identity/UserAvatar"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserAchievementsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserAchievementsSwr"
import { rankInfo, resolveSeniorityRank } from "@/modules/utils/rank"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link ProfileMenuCard}. */
export type ProfileMenuCardProps = WithClassNames<undefined>

/**
 * The DashboardPage rail's identity row: a rank-ringed avatar + display name +
 * @handle on the left, with a trailing caret. The whole row is a link to the
 * public profile. No level, no XP number — the only status surfaced is the
 * seniority rank encoded by the thin (2px) avatar ring colour; beginner/unranked
 * uses the neutral `--border` token rather than the flat grey rank hue.
 *
 * Self-contained container: reads the viewer from redux and derives the
 * seniority rank from the earned-achievement wall via SWR (deduped with the
 * rest of the page). `"use client"` for the store selector.
 *
 * @param props - optional className merged onto the row.
 */
export const ProfileMenuCard = ({
    className,
}: ProfileMenuCardProps) => {
    const locale = useLocale()
    const user = useAppSelector((state) => state.user.user)
    const achievementsSwr = useQueryUserAchievementsSwr(user?.id ?? null)
    const achievements = achievementsSwr.data

    /**
     * Readable name next to the avatar: the chosen display name, else the handle
     * before "@" so a raw email is never surfaced.
     */
    const displayName = useMemo(
        () => {
            const explicit = user?.displayName?.trim()
            if (explicit) {
                return explicit
            }
            const base = user?.email ?? user?.username ?? ""
            return base.split("@")[0]
        },
        [
            user,
        ],
    )

    // overall seniority rank → the ring colour (breadth-gated highest tier)
    const info = useMemo(
        () => {
            const earnedTiers = (achievements ?? [])
                .filter((item) => item.earned)
                .map((item) => item.tierReached ?? 1)
            return rankInfo(resolveSeniorityRank(earnedTiers))
        },
        [
            achievements,
        ],
    )

    // Ring colour: real seniority hue (junior=bronze · middle=silver · senior=gold). beginner/unranked reads as a
    // neutral grey (#8C95A1) → use the `--border` token so it's theme-clean, not a hardcoded grey.
    const ringColor = info.ring && info.rank !== "beginner" ? info.ring : "var(--border)"

    if (!user) {
        return null
    }

    return (
        <Link
            href={pathConfig().locale(locale).profile(user.username).build()}
            className={cn(
                "group flex cursor-pointer items-center justify-between gap-3 no-underline transition-opacity hover:opacity-80",
                className,
            )}
        >
            {/* avatar + name = left cluster; caret pinned right by justify-between */}
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                classNames={["min-w-0"]}
                items={[
                    () => (
                        // avatar with a thin 2px seniority ring — beginner/unranked → neutral `--border` token
                        <div
                            className="shrink-0 rounded-full ring-2"
                            style={{ "--tw-ring-color": ringColor } as React.CSSProperties}
                        >
                            <UserAvatar
                                className="size-10"
                                username={displayName}
                                avatar={user.avatar}
                                seed={user.username}
                            />
                        </div>
                    ),
                    () => (
                        <StackV
                            gap={1}
                            principle="name-handle"
                            explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                            classNames={["min-w-0"]}
                            items={[
                                () => (
                                    <span className="truncate text-sm font-semibold text-foreground">
                                        {displayName}
                                    </span>
                                ),
                                () => (
                                    <span className="truncate text-xs text-muted">
                                        @{user.username}
                                    </span>
                                ),
                            ]}
                        />
                    ),
                ]}
            />
            {/* trailing caret at the right edge; weight bold + slides on hover (mirrors "Continue →") */}
            <CaretRightIcon weight="bold" className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1" />
        </Link>
    )
}
