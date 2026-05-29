"use client"

import React from "react"
import {
    Avatar,
    AvatarFallback,
} from "@heroui/react"
import {
    truncate,
} from "lodash"
import type {
    UserEntity,
} from "@/modules/types"

/** Props for {@link ProfileHeader}. */
export interface ProfileHeaderProps {
    /** Signed-in user whose avatar + name + email are shown. */
    user: UserEntity
}

/**
 * Profile page header — large avatar, username, and email.
 *
 * Presentational (render-only): pure display from the `user` prop.
 * @param props - the authenticated user
 */
export const ProfileHeader = ({
    user,
}: ProfileHeaderProps) => {
    return (
        <div className="flex items-center gap-4">
            <Avatar className="size-16 text-xl">
                <AvatarFallback>
                    {truncate(user.username, { length: 1, omission: "" })}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold text-foreground">{user.username}</div>
                <div className="text-sm text-muted">{user.email}</div>
            </div>
        </div>
    )
}
