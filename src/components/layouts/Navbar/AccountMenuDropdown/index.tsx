
import {
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    Separator,
} from "@heroui/react"
import React, { useMemo } from "react"
import {
    useAccountMenuOverlayState,
    useAuthenticationOverlayState,
    useLanguageOverlayState,
    useMutationSignOutSwr,
} from "@/hooks/singleton"
import { BellIcon, CaretRightIcon } from "@phosphor-icons/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { languages } from "@/resources/constants"
import { useLocale, useTranslations } from "next-intl"
import { DarkLightModeSwitch } from "./DarkLightMode"
import { setAuthenticationModalTab } from "@/redux/slices"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import { truncate } from "lodash"
import { cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import { UserIcon } from "@phosphor-icons/react"

/**
 * Props for AccountMenuDropdown component.
 */
export type AccountMenuDropdownProps = WithClassNames<{
    button?: string
    menuContainer?: string
}>

/**
 * AccountActionItem interface
 */
export interface AccountActionItem {
    key: string
    label: string
    variant: "primary" | "tertiary"
    tab: AuthenticationModalTab
}
/**
 * AccountMenuDropdown displays account actions and settings in navbar.
 * @param props AccountMenuDropdownProps used for custom class names.
 */
export const AccountMenuDropdown = (props: AccountMenuDropdownProps) => {
    const { classNames } = props
    const { isOpen, setOpen, close } = useAccountMenuOverlayState()
    const user = useAppSelector((state) => state.user.user)
    const locale = useLocale()
    const t = useTranslations()
    const { open: openLanguage } = useLanguageOverlayState()
    const { open: openAuthentication } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()
    const mutateSignOutSwr = useMutationSignOutSwr()
    const currentLanguage = useMemo(
        () => languages.find((lang) => lang.code === locale),
        [locale]
    )
    const accountActionItems: Array<AccountActionItem> = useMemo(() => ([
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
    ]), [t])
    const isAuthenticated = useAppSelector((state) => state.keycloak.authenticated)
    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={cn(classNames?.menuContainer)}
        >
            {/** Dropdown trigger */}
            <>
                {!isAuthenticated ? (
                    <Button
                        onPress={() => setOpen(!isOpen)}
                        isIconOnly 
                        className="rounded-full" variant="tertiary">
                        <Badge size="sm" className="border-0" content="0" color="accent">
                            <Avatar size="sm" className="cursor-pointer">
                                <AvatarFallback>
                                    {truncate(user?.username, { length: 1 })}
                                </AvatarFallback>
                            </Avatar>
                        </Badge>
                    </Button>
                ) : (
                    <Button 
                        onPress={() => setOpen(!isOpen)}
                        isIconOnly className="rounded-full" variant="tertiary">
                        <UserIcon className="size-5" />
                    </Button>
                )}
            </>
            {/** Dropdown content */}
            <DropdownPopover placement="bottom right" className="min-w-[300px] overflow-hidden" >
                <div className="p-3">
                    {user ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="cursor-pointer">
                                    <AvatarFallback>
                                        {truncate(user?.username, { length: 1 })}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1">
                                    <div className="text-sm">
                                        {truncate(user?.username, { length: 10 })}
                                    </div>
                                    <div className="text-xs text-foreground-500">{user?.email}</div>
                                </div>
                            </div>
                            <Badge size="sm" className="border-0" content="0" color="accent">
                                <BellIcon className="size-6 text-divider" />
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {accountActionItems.map((item) => (
                                <Button
                                    key={item.key}
                                    variant={item.variant}
                                    onPress={() => {
                                        dispatch(setAuthenticationModalTab(item.tab))
                                        close()
                                        openAuthentication()
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                <Separator />
                <DropdownMenu>
                    {/** Settings block */}
                    <DropdownSection>
                        <DropdownItem
                            key="language"
                            onPress={() => {
                                close()
                                openLanguage()
                            }}
                            className="py-3"
                        >
                            <div className="flex items-center justify-between gap-3 w-full">
                                <div className="text-sm">{t("nav.toggleLanguage")}</div>
                                <div className="flex items-center gap-1 text-sm text-foreground-500">
                                    {currentLanguage?.label}
                                    <CaretRightIcon className="size-4" />
                                </div>
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
                <div className="flex items-center justify-between gap-3 py-3 px-4">
                    <div className="text-sm">{t("nav.appearance")}</div>
                    <DarkLightModeSwitch />
                </div>
                <Separator />
                <DropdownMenu>
                    {/** Logout block */}
                    <DropdownSection>
                        <DropdownItem
                            key="logout"
                            className="py-3 text-danger"
                            onPress={async () => {
                                await mutateSignOutSwr.trigger()
                            }}
                        >
                            {t("nav.logout")}
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </DropdownPopover>
        </Dropdown>
    )
}