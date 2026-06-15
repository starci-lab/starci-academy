"use client"

import { Bookmark as BookmarkSimpleIcon, ChevronRight as CaretRightIcon } from "@gravity-ui/icons"
import React from "react"
import {
    DropdownItem,
    DropdownMenu,
    DropdownSection,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link MenuList}. */
export interface MenuListProps {
    /** Whether a user object exists (controls the bookmarks section). */
    hasUser: boolean
    /** Current language label shown beside the language row. */
    currentLanguageLabel?: string
    /** Fired when the bookmarks item is pressed. */
    onOpenBookmarks: () => void
    /** Fired when the language item is pressed. */
    onOpenLanguage: () => void
}

/**
 * Dropdown body menu: an authenticated-only bookmarks section plus the
 * language switcher row.
 *
 * Presentational: forwards item presses upward via `onXXX` callbacks.
 * No business logic.
 * @param props - auth state, current language label, and item callbacks
 */
export const MenuList = ({
    hasUser,
    currentLanguageLabel,
    onOpenBookmarks,
    onOpenLanguage,
}: MenuListProps) => {
    const t = useTranslations()
    return (
        <DropdownMenu>
            {/** Settings block */}
            {hasUser && (
                <DropdownSection className="border-b border-divider pb-2 mb-2">
                    <DropdownItem
                        key="bookmarks"
                        onPress={onOpenBookmarks}
                        className="py-3"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <BookmarkSimpleIcon className="size-5" />
                            <div className="text-sm">{t("content.saved")}</div>
                        </div>
                    </DropdownItem>
                </DropdownSection>
            )}
            <DropdownSection>
                <DropdownItem
                    key="language"
                    onPress={onOpenLanguage}
                    className="py-3"
                >
                    <div className="flex items-center justify-between gap-3 w-full">
                        <div className="text-sm">{t("nav.toggleLanguage")}</div>
                        <div className="flex items-center gap-1 text-sm text-muted">
                            {currentLanguageLabel}
                            <CaretRightIcon className="size-4" />
                        </div>
                    </div>
                </DropdownItem>
            </DropdownSection>
        </DropdownMenu>
    )
}
