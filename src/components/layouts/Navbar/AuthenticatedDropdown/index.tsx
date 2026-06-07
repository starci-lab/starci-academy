"use client"

import { ArrowRightFromSquare as SignOutIcon, Person as UserIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    useRouter,
} from "@/i18n/navigation"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    pathConfig,
} from "@/resources/path"
import {
    useTranslations,
} from "next-intl"
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from "@heroui/react"
import {
    useLanguageOverlayState,
    useMutateSignOutSwr,
} from "@/hooks"
import {
    LocalStorage,
    LocalStorageId,
} from "@/modules/storage"
import {
    setAuthenticated,
} from "@/redux/slices"

/**
 * AuthenticatedDropdown — avatar menu showing the signed-in user's account,
 * a profile link, and sign-out.
 *
 * Container: reads user/auth redux state, owns the sign-out mutation, and
 * exposes `onXXX` handlers. `"use client"` for hooks + interactivity.
 */
export const AuthenticatedDropdown = () => {
    const user = useAppSelector((state) => state.user.user)
    const t = useTranslations()
    const router = useRouter()
    const { isOpen, setOpen } = useLanguageOverlayState()
    const mutateSignOutSwr = useMutateSignOutSwr()
    const dispatch = useAppDispatch()

    /** Close the dropdown without navigating (account header item). */
    const onCloseAccount = useCallback(
        () => setOpen(false),
        [
            setOpen,
        ],
    )

    /** Navigate to the profile page and close the dropdown. */
    const onOpenProfile = useCallback(
        () => {
            router.push(pathConfig().locale().profile().build())
            setOpen(false)
        },
        [
            router,
            setOpen,
        ],
    )

    /** Clear the stored token, run the sign-out mutation, and reset auth state. */
    const onLogout = useCallback(
        async () => {
            LocalStorage.removeItem(LocalStorageId.KeycloakAccessToken)
            await mutateSignOutSwr.trigger()
            dispatch(setAuthenticated(false))
        },
        [
            mutateSignOutSwr,
            dispatch,
        ],
    )

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setOpen}
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
                    <DropdownItem key="account" onPress={onCloseAccount}>
                        <div>
                            <div>{user?.username}</div>
                            <div className="text-xs text-muted">{user?.email}</div>
                        </div>
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection className="gap-1.5 flex flex-col">
                    <DropdownItem
                        key="profile"
                        onPress={onOpenProfile}
                    >
                        <div className="flex items-center gap-2">
                            <UserIcon className="size-5" />
                            {t("nav.profile")}
                        </div>
                    </DropdownItem>
                    <DropdownItem
                        key="logout"
                        className="text-danger"
                        onPress={onLogout}
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
