"use client"

import { UserIcon } from "@phosphor-icons/react"
import React, { useCallback } from "react"
import { Badge, Button } from "@heroui/react"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { useAppSelector } from "@/redux/hooks"
import { useAccountMenuOverlayState } from "@/hooks/zustand/overlay/hooks"

/**
 * Props for {@link AccountTrigger}.
 */
export type AccountTriggerProps = Record<string, never>
/**
 * Dropdown trigger button shown in the navbar.
 *
 * Container: reads auth state + user from Redux and opens the account-menu
 * overlay itself. Renders a generic user icon for guests or an avatar badge
 * for authenticated users.
 * `"use client"` for store selectors + press handler.
 * @param props - optional root class name
 */
export const AccountTrigger = () => {
    const isAuthenticated = useAppSelector((state) => state.keycloak.authenticated)
    const user = useAppSelector((state) => state.user.user)
    const { open } = useAccountMenuOverlayState()

    /** Open the account dropdown. */
    const onOpen = useCallback(() => open(), [open])

    if (!isAuthenticated) {
        return (
            <Button
                onPress={onOpen}
                isIconOnly
                className={"rounded-full"}
                variant="tertiary"
            >
                <UserIcon className="size-5" />
            </Button>
        )
    }
    return (
        <Button
            onPress={onOpen}
            isIconOnly
            className={"rounded-full"}
            variant="tertiary"
        >
            <Badge.Anchor>
                <UserAvatar
                    size="sm"
                    className="cursor-pointer"
                    username={user?.username}
                    avatar={user?.avatar}
                    seed={user?.email ?? user?.username}
                />
                <Badge size="sm" color="accent">5</Badge>
            </Badge.Anchor>
        </Button>
    )
}
