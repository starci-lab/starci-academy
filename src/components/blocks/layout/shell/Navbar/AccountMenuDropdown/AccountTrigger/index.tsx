"use client"

import React, { useCallback } from "react"
import { useAppSelector } from "@/redux/hooks"
import { useAccountMenuOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _AccountTrigger } from "./component"

/** Props for {@link AccountTrigger}. */
export type AccountTriggerProps = WithClassNames<undefined>

/**
 * Dropdown trigger button shown in the navbar — the CONNECTED half: reads
 * auth state + user from Redux and opens the account-menu overlay itself. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const AccountTrigger = ({ className }: AccountTriggerProps) => {
    const isAuthenticated = useAppSelector((state) => state.keycloak.authenticated)
    const user = useAppSelector((state) => state.user.user)
    const { open } = useAccountMenuOverlayState()

    /** Open the account dropdown. */
    const onOpen = useCallback(() => open(), [open])

    return (
        <_AccountTrigger
            isAuthenticated={Boolean(isAuthenticated)}
            username={user?.username}
            avatar={user?.avatar}
            email={user?.email}
            onOpen={onOpen}
            className={className}
        />
    )
}
