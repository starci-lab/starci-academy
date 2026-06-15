"use client"

import React from "react"
import {
    Dropdown,
    DropdownPopover,
    Separator,
    cn,
} from "@heroui/react"
import {
    useAccountMenuOverlayState,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import { AccountTrigger } from "./AccountTrigger"
import { UserSummary } from "./UserSummary"
import { AuthActions } from "./AuthActions"
import { MenuList } from "./MenuList"
import { AppearanceRow } from "./AppearanceRow"
import { LogoutMenu } from "./LogoutMenu"

/**
 * Props for {@link AccountMenuDropdown}.
 */
export type AccountMenuDropdownProps = WithClassNames<{
    /** Optional class applied to the dropdown container. */
    menuContainer?: string
}>

/**
 * AccountMenuDropdown — navbar account menu.
 *
 * Container: owns the dropdown overlay open/close state and delegates all
 * data-fetching and action-dispatching to its self-contained child containers.
 * `"use client"` for the overlay hook.
 * @param props - optional class-name overrides
 */
export const AccountMenuDropdown = (props: AccountMenuDropdownProps) => {
    const { classNames } = props
    const { isOpen, setOpen } = useAccountMenuOverlayState()
    const user = useAppSelector((state) => state.user.user)

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={cn(classNames?.menuContainer)}
        >
            {/** Dropdown trigger */}
            <AccountTrigger />
            {/** Dropdown content */}
            <DropdownPopover placement="bottom right" className="min-w-[300px] overflow-hidden">
                <div className="p-3">
                    {user ? (
                        <UserSummary />
                    ) : (
                        <AuthActions />
                    )}
                </div>
                <Separator />
                <MenuList />
                <AppearanceRow />
                <Separator />
                <LogoutMenu />
            </DropdownPopover>
        </Dropdown>
    )
}
