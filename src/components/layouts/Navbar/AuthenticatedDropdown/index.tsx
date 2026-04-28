import { useRouter } from "@/i18n/navigation"
import { useAppDispatch, useAppSelector } from "@/redux"
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
import { 
    useLanguageOverlayState, 
    useMutationSignOutSwr 
} from "@/hooks/singleton"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import { setAuthenticated } from "@/redux/slices"

/**
 * AuthenticatedDropdown is a dropdown component that is used to display the authenticated user's information.
 */
export const AuthenticatedDropdown = () => {
    const user = useAppSelector((state) => state.user.user)
    const t = useTranslations()
    const router = useRouter()
    const { isOpen, onOpenChange } = useLanguageOverlayState()
    const mutateSignOutSwr = useMutationSignOutSwr()
    const dispatch = useAppDispatch()
    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <DropdownTrigger>
                <Avatar className="cursor-pointer">
                    <Avatar.Image src={user?.avatar} alt={user?.username ?? ""} />
                    <Avatar.Fallback>
                        {(user?.username?.[0] ?? "?").toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
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
                            async () => {
                                LocalStorage.removeItem(
                                    LocalStorageId.KeycloakAccessToken
                                )
                                await mutateSignOutSwr.trigger()
                                dispatch(setAuthenticated(false))
                            }
                        }
                    >
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