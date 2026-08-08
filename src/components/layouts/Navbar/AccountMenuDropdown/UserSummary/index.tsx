"use client"

import React from "react"
import { UserCell } from "@/components/composites/lists/UserCell"
import { useAppSelector } from "@/redux/hooks"
import { Box } from "@/components/frames/Box"

/**
 * Props for {@link UserSummary}.
 */

/**
 * Header row for the account menu: the signed-in user's avatar + username +
 * email, rendered via the {@link UserCell} block (so it stays compact and matches
 * `Skeleton.UserCell`). Container: reads the user from redux.
 */
export const UserSummary = () => {
    const user = useAppSelector((state) => state.user.user)
    return (
        <Box
            identity={{ tier: "layout", component: "UserSummary" }}
            principle="identity"
            explain="Account menu identity row — carries layout identity on the frame that owns avatar|name."
        >
            <UserCell
                username={user?.username ?? ""}
                avatar={user?.avatar}
                handle={user?.email ?? undefined}
            />
        </Box>
    )
}
