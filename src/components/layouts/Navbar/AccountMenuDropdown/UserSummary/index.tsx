"use client"

import React from "react"
import {
    Avatar,
    AvatarFallback,
    Badge,
} from "@heroui/react"
import {
    BellIcon,
} from "@phosphor-icons/react"
import { truncate } from "lodash"
import type {
    UserEntity,
} from "@/modules/types"

/** Props for {@link UserSummary}. */
export interface UserSummaryProps {
    /** Authenticated user whose name + email are displayed. */
    user: UserEntity
}

/**
 * Header panel for authenticated users: avatar, truncated username, email,
 * and a notification bell badge.
 *
 * Presentational: pure display from the `user` prop. No business logic.
 * @param props - the authenticated user
 */
export const UserSummary = ({
    user,
}: UserSummaryProps) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Avatar className="cursor-pointer">
                    <AvatarFallback>
                        {truncate(user?.username, { length: 1 })}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <div className="text-sm">
                        {truncate(user?.username, { length: 10 })}
                    </div>
                    <div className="text-xs text-muted">{user?.email}</div>
                </div>
            </div>
            <Badge size="sm" className="border-0" content="0" color="accent">
                <BellIcon className="size-6 text-divider" />
            </Badge>
        </div>
    )
}
