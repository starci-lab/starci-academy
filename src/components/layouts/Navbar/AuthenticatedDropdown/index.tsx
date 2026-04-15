import { useKeycloak } from "@/hooks/singleton"
import { useRouter } from "@/i18n/navigation"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources/path"
import { SignOutIcon, UserIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from "@heroui/react"
import React from "react"
import { useLanguageOverlayState } from "@/hooks/singleton"

/**
 * AuthenticatedDropdown is a dropdown component that is used to display the authenticated user's information.
 */
export const AuthenticatedDropdown = () => {
    const user = useAppSelector((state) => state.user.user)
    const t = useTranslations()
    const router = useRouter()
    const keycloak = useKeycloak()
    const { isOpen, onOpenChange } = useLanguageOverlayState()
    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <DropdownTrigger>
                <Avatar
                    src={user?.avatar}
                    className="cursor-pointer"
                    name={user?.username} 
                />
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownSection>
                    <DropdownItem key="account" onPress={() => onOpenChange(false)}>
                        <div>
                            <div>{user?.username}</div>
                            <div className="text-xs text-foreground-500">{user?.email}</div>
                        </div>
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection className="gap-1.5 flex flex-col">
                    <DropdownItem
                        key="profile" 
                        onPress={() => {
                            router.push(pathConfig().locale().profile().build())
                            onOpenChange(false)
                        }}>
                        <div className="flex items-center gap-2">
                            <UserIcon className="size-5" />
                            {t("nav.profile")}
                        </div>
                    </DropdownItem>
                    <DropdownItem
                        key="logout" 
                        className="text-danger"
                        onPress={
                            () => keycloak.data?.logout(
                                {
                                    redirectUri: `${window.location.origin}${pathConfig().locale().authentication().google().logout().build()}`,
                                }
                            )
                        }>
                        <div className="flex items-center gap-2">
                            <SignOutIcon className="size-5 text-danger" />
                            {t("nav.logout")}
                        </div>
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}