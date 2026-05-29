"use client"

import React from "react"
import {
    Dropdown,
    DropdownPopover,
    Separator,
    cn,
} from "@heroui/react"
import { useCallback, useMemo } from "react"
import {
    useAccountMenuOverlayState,
    useAuthenticationOverlayState,
    useLanguageOverlayState,
    useMutationSignOutSwr,
} from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import { languages } from "@/resources/constants"
import { useLocale, useTranslations } from "next-intl"
import { setAuthenticationModalTab } from "@/redux/slices"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types"
import type { AccountActionItem } from "./types"
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
    /** Optional class for the trigger button (currently unused by callers). */
    button?: string
    /** Optional class applied to the dropdown container. */
    menuContainer?: string
}>

/**
 * AccountMenuDropdown — navbar account menu.
 *
 * Container: owns the dropdown overlay state, auth/user redux selectors,
 * navigation, the sign-out mutation, and all `onXXX` actions; renders
 * presentational children. `"use client"` for hooks + interactivity.
 * @param props - optional class-name overrides
 */
export const AccountMenuDropdown = (props: AccountMenuDropdownProps) => {
    const { classNames } = props
    const { isOpen, open, close, setOpen } = useAccountMenuOverlayState()
    const user = useAppSelector((state) => state.user.user)
    const locale = useLocale()
    const t = useTranslations()
    const router = useRouter()
    const { open: openLanguage } = useLanguageOverlayState()
    const { open: openAuthentication } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()
    const mutateSignOutSwr = useMutationSignOutSwr()
    const isAuthenticated = useAppSelector((state) => state.keycloak.authenticated)

    /** Language entry matching the active locale (for the label). */
    const currentLanguage = useMemo(
        () => languages.find((lang) => lang.code === locale),
        [
            locale,
        ],
    )

    /** Auth call-to-action buttons shown to signed-out users. */
    const accountActionItems = useMemo<Array<AccountActionItem>>(
        () => [
            {
                key: "sign-in",
                label: t("auth.signIn.submit"),
                variant: "primary",
                tab: AuthenticationModalTab.SignIn,
            },
            {
                key: "sign-up",
                label: t("auth.signUp.submit"),
                variant: "tertiary",
                tab: AuthenticationModalTab.SignUp,
            },
        ],
        [
            t,
        ],
    )

    const onOpen = useCallback(
        () => open(),
        [
            open,
        ],
    )

    /** Open the auth modal on the chosen tab and close this dropdown. */
    const onSelectAction = useCallback(
        (item: AccountActionItem) => {
            dispatch(setAuthenticationModalTab(item.tab))
            close()
            openAuthentication()
        },
        [
            dispatch,
            close,
            openAuthentication,
        ],
    )

    /** Close the dropdown and navigate to the bookmarks page. */
    const onOpenBookmarks = useCallback(
        () => {
            close()
            router.push(pathConfig().locale().profile().bookmarks().build())
        },
        [
            close,
            router,
        ],
    )

    /** Close the dropdown and open the language overlay. */
    const onOpenLanguage = useCallback(
        () => {
            close()
            openLanguage()
        },
        [
            close,
            openLanguage,
        ],
    )

    /** Trigger the sign-out mutation. */
    const onLogout = useCallback(
        async () => {
            await mutateSignOutSwr.trigger()
        },
        [
            mutateSignOutSwr,
        ],
    )

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={cn(classNames?.menuContainer)}
        >
            {/** Dropdown trigger */}
            <AccountTrigger
                isAuthenticated={isAuthenticated}
                user={user}
                onOpen={onOpen}
            />
            {/** Dropdown content */}
            <DropdownPopover placement="bottom right" className="min-w-[300px] overflow-hidden">
                <div className="p-3">
                    {user ? (
                        <UserSummary user={user} />
                    ) : (
                        <AuthActions
                            items={accountActionItems}
                            onSelectAction={onSelectAction}
                        />
                    )}
                </div>
                <Separator />
                <MenuList
                    hasUser={!!user}
                    currentLanguageLabel={currentLanguage?.label}
                    onOpenBookmarks={onOpenBookmarks}
                    onOpenLanguage={onOpenLanguage}
                />
                <AppearanceRow />
                <Separator />
                <LogoutMenu onLogout={onLogout} />
            </DropdownPopover>
        </Dropdown>
    )
}
