import { BookmarkSimpleIcon, CaretRightIcon } from "@phosphor-icons/react"
import { FaGithub } from "react-icons/fa6"
import React from "react"
import {
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _MenuList} — presentational; auth state + labels already resolved. */
export interface MenuListProps extends WithClassNames<undefined> {
    /** `true` → show the bookmarks (+ optional link-GitHub) section above the language row. */
    isAuthenticated: boolean
    /** `true` → show the manual "Link GitHub" entry point (authenticated + not yet linked). */
    showLinkGithub: boolean
    /** Already-localized "Link GitHub" label. */
    linkGithubLabel: string
    /** Already-localized "Saved" (bookmarks) label. */
    bookmarksLabel: string
    /** Already-localized "Toggle language" label. */
    toggleLanguageLabel: string
    /** Already-localized name of the currently active language. */
    currentLanguageLabel?: string
    /** Fired when the "Link GitHub" row is pressed. */
    onLinkGithub: () => void
    /** Fired when the bookmarks row is pressed. */
    onOpenBookmarks: () => void
    /** Fired when the language row is pressed. */
    onOpenLanguage: () => void
}

/**
 * Dropdown body menu: an authenticated-only bookmarks section plus the
 * language switcher row.
 *
 * @param props - {@link MenuListProps}
 */
export const _MenuList = ({
    isAuthenticated,
    showLinkGithub,
    linkGithubLabel,
    bookmarksLabel,
    toggleLanguageLabel,
    currentLanguageLabel,
    onLinkGithub,
    onOpenBookmarks,
    onOpenLanguage,
    className,
}: MenuListProps) => (
    <DropdownMenu className={cn(className)}>
        {/** Settings block */}
        {isAuthenticated && (
            <DropdownSection className="border-b border-divider pb-2 mb-2">
                {/* manual GitHub-link entry point — self-hides once the account is linked */}
                {showLinkGithub ? (
                    <DropdownItem
                        key="link-github"
                        onPress={onLinkGithub}
                        className="py-3"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <FaGithub className="size-5" />
                            <div className="text-sm">{linkGithubLabel}</div>
                        </div>
                    </DropdownItem>
                ) : null}
                <DropdownItem
                    key="bookmarks"
                    onPress={onOpenBookmarks}
                    className="py-3"
                >
                    <div className="flex items-center gap-3 w-full">
                        <BookmarkSimpleIcon className="size-5" />
                        <div className="text-sm">{bookmarksLabel}</div>
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
                    <div className="text-sm">{toggleLanguageLabel}</div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                        {currentLanguageLabel}
                        <CaretRightIcon weight="bold" className="size-4" />
                    </div>
                </div>
            </DropdownItem>
        </DropdownSection>
    </DropdownMenu>
)
