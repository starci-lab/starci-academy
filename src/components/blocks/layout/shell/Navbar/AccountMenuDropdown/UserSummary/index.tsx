"use client"

import React from "react"
import { truncate } from "lodash"
import { useAppSelector } from "@/redux/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _UserSummary } from "./component"

/** Props for {@link UserSummary}. */
export type UserSummaryProps = WithClassNames<undefined>

/**
 * Header panel for authenticated users — the CONNECTED half: reads the
 * authenticated user from the Redux store itself. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const UserSummary = ({ className }: UserSummaryProps) => {
    const user = useAppSelector((state) => state.user.user)
    return (
        <_UserSummary
            truncatedUsername={truncate(user?.username, { length: 10 })}
            username={user?.username}
            avatar={user?.avatar}
            avatarSeed={user?.email ?? user?.username}
            email={user?.email}
            className={className}
        />
    )
}
