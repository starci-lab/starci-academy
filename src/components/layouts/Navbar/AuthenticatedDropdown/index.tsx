import { useKeycloak } from "@/hooks/singleton"
import { useRouter } from "@/i18n/navigation"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources/path"
import { SignOutIcon, UserIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import {
    StarCiAvatar,
    StarCiDropdown,
    StarCiDropdownItem,
    StarCiDropdownMenu,
    StarCiDropdownSection,
    StarCiDropdownTrigger
} from "../../../atomic"

/**
 * AuthenticatedDropdown is a dropdown component that is used to display the authenticated user's information.
 */
export const AuthenticatedDropdown = () => {
    const user = useAppSelector((state) => state.user.user)
    const t = useTranslations()
    const router = useRouter()
    const keycloak = useKeycloak()
    return (
        <StarCiDropdown>
            <StarCiDropdownTrigger>
                <StarCiAvatar 
                    src={user?.avatar}
                    className="cursor-pointer"
                    color="primary" 
                    name={user?.username} 
                />
            </StarCiDropdownTrigger>
            <StarCiDropdownMenu>
                <StarCiDropdownSection showDivider>
                    <StarCiDropdownItem key="account">
                        <div>
                            <div>{user?.username}</div>
                            <div className="text-xs text-foreground-500">{user?.email}</div>
                        </div>
                    </StarCiDropdownItem>
                </StarCiDropdownSection>
                <StarCiDropdownSection classNames={
                    {
                        group: "gap-1.5 flex flex-col",
                    }
                }>
                    <StarCiDropdownItem 
                        variant="flat" 
                        key="profile" 
                        onPress={() => router.push(pathConfig().locale().profile().build())}
                        startContent={
                            <UserIcon className="size-5" />
                        }>
                        {t("nav.profile")}
                    </StarCiDropdownItem>
                    <StarCiDropdownItem 
                        variant="flat" 
                        color="danger" 
                        key="logout" 
                        classNames={{
                            title: "text-danger",
                        }}
                        onPress={
                            () => keycloak.data?.logout(
                                {
                                    redirectUri: `${window.location.origin}${pathConfig().locale().authentication().google().logout().build()}`,
                                }
                            )
                        }
                        startContent={
                            <SignOutIcon className="size-5 text-danger" />
                        }>
                        {t("nav.logout")}
                    </StarCiDropdownItem>
                </StarCiDropdownSection>   
            </StarCiDropdownMenu>
        </StarCiDropdown>
    )
}