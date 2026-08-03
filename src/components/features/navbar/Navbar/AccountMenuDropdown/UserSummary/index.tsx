"use client"

import React from "react"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { useAppSelector } from "@/redux/hooks"

/**
 * Header row for the account menu: the signed-in user's avatar + username +
 * email, rendered via the {@link UserCell} block (so it stays compact and matches
 * `Skeleton.UserCell`). Container: reads the user from redux.
 */
export const UserSummary = () => {
    const user = useAppSelector((state) => state.user.user)
    return (
        <UserCell
            username={user?.username ?? ""}
            avatar={user?.avatar}
            handle={user?.email ?? undefined}
        />
    )
}
