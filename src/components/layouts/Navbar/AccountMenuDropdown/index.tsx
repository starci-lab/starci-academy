import { 
    StarCiAvatar, 
    StarCiDropdown, 
    StarCiDropdownTrigger, 
    StarCiDropdownMenu, 
    StarCiDropdownSection, 
    StarCiDropdownItem, 
    StarCiButton, 
    StarCiBadge
} from "@/components/atomic"
import React from "react"
import { useAccountMenuDisclosure, useAuthenticationDisclosure, useKeycloak } from "@/hooks/singleton"
import { BellIcon, CaretRightIcon, ListIcon } from "@phosphor-icons/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { languages } from "@/resources/constants"
import { useLocale } from "next-intl"
import { useLanguageDisclosure } from "@/hooks/singleton"
import { DarkLightModeSwitch } from "../../DarkLightMode"
import { setAuthenticationModalTab } from "@/redux/slices"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import { truncate } from "lodash"

export const AccountMenuDropdown = () => {
    const { isOpen, onOpenChange, onClose } = useAccountMenuDisclosure()
    const keycloak = useKeycloak()
    const user = useAppSelector((state) => state.user.user)
    const locale = useLocale()
    const currentLanguage = languages.find((lang) => lang.code === locale)
    const { onOpenChange: onLanguageOpen } = useLanguageDisclosure()
    const { onOpen: onAuthenticationOpen } = useAuthenticationDisclosure()
    const dispatch = useAppDispatch()
    return (
        <StarCiDropdown
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className="w-[300px]"
        >
            <StarCiDropdownTrigger>
                <StarCiButton 
                    className="border border-divider rounded-full p-1 flex items-center justify-center gap-1 bg-transparent min-w-fit overflow-visible"
                >
                    <ListIcon className="size-5 text-foreground-500" />
                    {keycloak?.isLoading ? (
                        <StarCiButton 
                            isIconOnly
                            isLoading
                            size="sm"
                            radius="full" 
                            onPress={onOpenChange}
                        />
                    ) : keycloak?.data?.authenticated ? (
                        <>
                            <StarCiBadge size="sm" className="border-0" content="0" color="secondary">
                                <StarCiAvatar
                                    size="sm"
                                    src={user?.avatar}
                                    className="cursor-pointer"
                                    color="primary"
                                    name={user?.username}
                                />
                            </StarCiBadge>
                        </>
                    ) : (
                        <StarCiAvatar
                            size="sm"
                        />
                    )
                    }
                </StarCiButton>
            </StarCiDropdownTrigger>
            <StarCiDropdownMenu closeOnSelect={false}>
                <StarCiDropdownSection showDivider>
                    <StarCiDropdownItem key="account" isReadOnly 
                        classNames={{
                            base: "data-[hover=true]:bg-transparent data-[selectable=true]:focus:bg-transparent data-[focus-visible=true]:outline-none",
                        }}>
                        {   
                            user ? (
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <StarCiAvatar
                                            src={user?.avatar}
                                            className="cursor-pointer"
                                            color="primary"
                                            name={user?.username}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm">Hi, {truncate(user?.username, { length: 10 })}...</div>
                                            <div className="text-xs text-foreground-500">{user?.email}</div>
                                        </div>
                                    </div>
                                    <StarCiBadge size="sm" className="border-0" content="0" color="secondary">
                                        <BellIcon className="size-6 text-divider" />
                                    </StarCiBadge>
                                </div>
                            ) : (
                                <div className="flex flex-items-center gap-2">
                                    <StarCiButton 
                                        color="primary"
                                        onPress={
                                            () => {
                                                dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignIn))
                                                onClose()
                                                onAuthenticationOpen()
                                            }
                                        }
                                    >
                                    Sign In
                                    </StarCiButton>
                                    <StarCiButton 
                                        color="primary"
                                        variant="flat"
                                        onPress={
                                            () => {
                                                dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignUp))
                                                onClose()
                                                onAuthenticationOpen()
                                            }
                                        }
                                    >
                                    Sign Up
                                    </StarCiButton>
                                </div>
                            )
                        }
                    </StarCiDropdownItem>
                </StarCiDropdownSection>
                <StarCiDropdownSection showDivider>
                    <StarCiDropdownItem key="language" onPress={
                        () => {
                            onClose()
                            onLanguageOpen()
                        }} className="py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-sm">Language</div>
                            <div className="flex items-center gap-1 text-sm text-foreground-500">
                                {currentLanguage?.label}
                                <CaretRightIcon className="size-4" />
                            </div>
                        </div>
                    </StarCiDropdownItem>
                    <StarCiDropdownItem key="theme" 
                        classNames={
                            {
                                base: "data-[hover=true]:bg-transparent data-[selectable=true]:focus:bg-transparent data-[focus-visible=true]:outline-none",
                            }
                        }>
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-sm">Theme</div>
                            <DarkLightModeSwitch />
                        </div>
                    </StarCiDropdownItem>
                </StarCiDropdownSection>
                <StarCiDropdownSection>
                    <StarCiDropdownItem 
                        key="logout" 
                        variant="flat"
                        color="danger"
                        className="py-3"
                        classNames={{
                            title: "text-danger",
                        }}
                    >
                        Sign Out
                    </StarCiDropdownItem>
                </StarCiDropdownSection>
            </StarCiDropdownMenu>
        </StarCiDropdown>
    )
}