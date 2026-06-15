"use client"

import React from "react"
import {
    DropdownItem,
    DropdownMenu,
    DropdownSection,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link LogoutMenu}. */
export interface LogoutMenuProps {
    /** Fired when the logout item is pressed. */
    onLogout: () => void
}

/**
 * Logout section of the account dropdown.
 *
 * Presentational: forwards the logout intent via `onLogout`. No business logic.
 * @param props - the logout callback
 */
export const LogoutMenu = ({
    onLogout,
}: LogoutMenuProps) => {
    const t = useTranslations()
    return (
        <DropdownMenu>
            {/** Logout block */}
            <DropdownSection>
                <DropdownItem
                    key="logout"
                    className="py-3 text-danger"
                    onPress={onLogout}
                >
                    {t("nav.logout")}
                </DropdownItem>
            </DropdownSection>
        </DropdownMenu>
    )
}
