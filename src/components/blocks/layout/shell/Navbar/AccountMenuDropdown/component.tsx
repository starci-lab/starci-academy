import React from "react"
import {
    Dropdown,
    DropdownPopover,
    Separator,
    cn,
} from "@heroui/react"
import { AccountTrigger } from "./AccountTrigger"
import { UserSummary } from "./UserSummary"
import { AuthActions } from "./AuthActions"
import { MenuList } from "./MenuList"
import { AppearanceRow } from "./AppearanceRow"
import { LogoutMenu } from "./LogoutMenu"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _AccountMenuDropdown} — presentational; open-state + auth already resolved. */
export interface AccountMenuDropdownProps extends WithClassNames<{
    /** Optional class applied to the dropdown container. */
    menuContainer?: string
}> {
    /** Whether the dropdown popover is open. */
    isOpen: boolean
    /** Fired with the new open state (backdrop click, Escape, trigger press). */
    onOpenChange: (open: boolean) => void
    /** `true` → show {@link UserSummary}; `false` → show {@link AuthActions}. */
    isAuthenticated: boolean
}

/**
 * AccountMenuDropdown — navbar account menu.
 *
 * Arrangement only: every section below (trigger, summary/auth, menu list,
 * appearance row, logout) is itself a self-contained CONNECTED block that
 * fetches/dispatches its own data — this component only lays them out and
 * owns the popover's open state + the summary/auth-actions switch.
 *
 * @param props - {@link AccountMenuDropdownProps}
 */
export const _AccountMenuDropdown = ({ isOpen, onOpenChange, isAuthenticated, classNames }: AccountMenuDropdownProps) => (
    <Dropdown
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={cn(classNames?.menuContainer)}
    >
        {/** Dropdown trigger */}
        <AccountTrigger />
        {/** Dropdown content */}
        <DropdownPopover placement="bottom right" className="min-w-[300px] overflow-hidden">
            <div className="p-3">
                {isAuthenticated ? (
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
