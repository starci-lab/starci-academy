import React from "react"
import {
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _LogoutMenu} — presentational; the label already resolved. */
export interface LogoutMenuProps extends WithClassNames<undefined> {
    /** Already-localized "Log out" label. */
    label: string
    /** Fired when the item is pressed — triggers sign-out. */
    onLogout: () => void
}

/**
 * Logout section of the account dropdown.
 *
 * @param props - {@link LogoutMenuProps}
 */
export const _LogoutMenu = ({ label, onLogout, className }: LogoutMenuProps) => (
    <DropdownMenu className={cn(className)}>
        {/** Logout block */}
        <DropdownSection>
            <DropdownItem
                key="logout"
                className="py-3 text-danger-soft-foreground"
                onPress={onLogout}
            >
                {label}
            </DropdownItem>
        </DropdownSection>
    </DropdownMenu>
)
