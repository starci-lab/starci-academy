"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    useAppSelector,
} from "@/redux"
import {
    UserAvatar,
} from "@/components/reuseable"

/** Props for {@link ProfileHeader}. */
export type ProfileHeaderProps = WithClassNames<undefined>

/**
 * Profile page header — large avatar, display name (falls back to username),
 * email, optional bio, and follower / following counts.
 *
 * Container: reads the signed-in user from the redux store directly.
 * Returns null when no user is present (the parent already guards this case).
 * @param props.className - Optional wrapper class merged into the root element.
 */
export const ProfileHeader = ({
    className,
}: ProfileHeaderProps) => {
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)

    if (!user) {
        return null
    }

    // prefer the user-chosen display name, fall back to the Keycloak username
    const name = user.displayName?.trim() ? user.displayName : user.username

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center gap-3">
                <UserAvatar
                    username={name}
                    avatar={user.avatar}
                    seed={user.email ?? user.username}
                    size="lg"
                    className="size-20 text-2xl"
                />
                <div className="flex min-w-0 flex-col gap-0">
                    <div className="truncate text-2xl font-bold text-foreground">{name}</div>
                    <div className="truncate text-sm text-muted">{user.email}</div>
                    {/* follower / following — compact, GitHub-style inline counts */}
                    <div className="mt-1 flex items-center gap-3 text-sm">
                        <span className="text-foreground">
                            <span className="font-semibold">{user.followerCount ?? 0}</span>
                            <span className="ml-1 text-muted">{t("profile.followers")}</span>
                        </span>
                        <span className="text-foreground">
                            <span className="font-semibold">{user.followingCount ?? 0}</span>
                            <span className="ml-1 text-muted">{t("profile.following")}</span>
                        </span>
                    </div>
                </div>
            </div>
            {/* bio sits below the identity row when present */}
            {user.bio?.trim() ? (
                <div className="whitespace-pre-wrap break-words text-sm text-foreground">{user.bio}</div>
            ) : null}
        </div>
    )
}
