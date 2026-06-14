"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    UserEntity,
} from "@/modules/types"
import {
    UserAvatar,
} from "@/components/reuseable"

/** Props for {@link ProfileHeader}. */
export interface ProfileHeaderProps {
    /** Signed-in user whose avatar + name + email + follow counts are shown. */
    user: UserEntity
}

/**
 * Profile page header — large avatar, display name (falls back to username),
 * email, optional bio, and follower / following counts.
 *
 * Presentational (render-only): pure display from the `user` prop.
 * @param props - the authenticated user
 */
export const ProfileHeader = ({
    user,
}: ProfileHeaderProps) => {
    const t = useTranslations()

    // prefer the user-chosen display name, fall back to the Keycloak username
    const name = user.displayName?.trim() ? user.displayName : user.username

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <UserAvatar
                    username={name}
                    avatar={user.avatar}
                    size="lg"
                    className="size-20 text-2xl"
                />
                <div className="flex min-w-0 flex-col gap-1">
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
