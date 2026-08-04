import { UserIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Badge,
    Button,
    cn,
} from "@heroui/react"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _AccountTrigger} — presentational; auth state already resolved. */
export interface AccountTriggerProps extends WithClassNames<undefined> {
    /** Whether the viewer is signed in — decides the generic icon vs the avatar badge. */
    isAuthenticated: boolean
    /** The signed-in user's display fields (avatar seed material). Ignored when signed out. */
    username?: string
    avatar?: string | null
    email?: string
    /** Fired when the trigger is pressed — opens the account dropdown. */
    onOpen: () => void
}

/**
 * Dropdown trigger button shown in the navbar: a generic user icon for guests
 * or an avatar badge for authenticated users.
 *
 * @param props - {@link AccountTriggerProps}
 */
export const _AccountTrigger = ({ isAuthenticated, username, avatar, email, onOpen, className }: AccountTriggerProps) => {
    if (!isAuthenticated) {
        return (
            <Button
                onPress={onOpen}
                isIconOnly
                className={cn("rounded-full", className)}
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
            className={cn("rounded-full", className)}
            variant="tertiary"
        >
            <Badge.Anchor>
                <UserAvatar
                    size="sm"
                    className="cursor-pointer"
                    username={username}
                    avatar={avatar}
                    seed={email ?? username}
                />
                <Badge size="sm" color="accent">5</Badge>
            </Badge.Anchor>
        </Button>
    )
}
