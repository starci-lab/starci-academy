"use client"

import React from "react"
import { useAccountMenuOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _AccountMenuDropdown } from "./component"

/** Props for {@link AccountMenuDropdown}. */
export type AccountMenuDropdownProps = WithClassNames<{
    /** Optional class applied to the dropdown container. */
    menuContainer?: string
}>

/**
 * AccountMenuDropdown — navbar account menu — the CONNECTED half: owns the
 * dropdown overlay open/close state and reads whether the viewer is signed
 * in (decides {@link import("./UserSummary").UserSummary} vs
 * {@link import("./AuthActions").AuthActions}); every other section wires
 * its own data. See `design/storybook/architecture/split.md`.
 * @param props - optional class-name overrides
 */
export const AccountMenuDropdown = (props: AccountMenuDropdownProps) => {
    const { classNames } = props
    const { isOpen, setOpen } = useAccountMenuOverlayState()
    const user = useAppSelector((state) => state.user.user)

    return (
        <_AccountMenuDropdown
            isOpen={isOpen}
            onOpenChange={setOpen}
            isAuthenticated={Boolean(user)}
            classNames={classNames}
        />
    )
}
