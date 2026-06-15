"use client"

import { Person as UserIcon } from "@gravity-ui/icons"
import React from "react"
import {
    Badge,
    Button,
} from "@heroui/react"
import { UserAvatar } from "@/components/reuseable/UserAvatar"
import type {

    UserEntity,
} from "@/modules/types"

/** Props for {@link AccountTrigger}. */
export interface AccountTriggerProps {
    /** Whether the visitor is authenticated (drives avatar vs. generic icon). */
    isAuthenticated: boolean
    /** Current user, used for the avatar initials when authenticated. */
    user: UserEntity | null
    /** Fired when the trigger button is pressed (opens the dropdown). */
    onOpen: () => void
}

/**
 * Dropdown trigger button shown in the navbar.
 *
 * Presentational: renders a generic user icon for guests or an avatar with a
 * notification badge for authenticated users. No business logic.
 * @param props - auth state, user, and the open callback
 */
export const AccountTrigger = ({
    isAuthenticated,
    user,
    onOpen,
}: AccountTriggerProps) => {
    if (!isAuthenticated) {
        return (
            <Button
                onPress={onOpen}
                isIconOnly
                className="rounded-full"
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
            className="rounded-full"
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
