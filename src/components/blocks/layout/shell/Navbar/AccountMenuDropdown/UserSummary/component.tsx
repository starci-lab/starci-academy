import { BellIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Badge,
    cn,
} from "@heroui/react"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _UserSummary} — presentational; the display fields already resolved. */
export interface UserSummaryProps extends WithClassNames<undefined> {
    /** Already-truncated display username. */
    truncatedUsername: string
    /** Avatar image, or `undefined` for the generated fallback. */
    avatar?: string | null
    /** Avatar seed material (email preferred, else username). */
    avatarSeed?: string
    /** Raw username (avatar generation input). */
    username?: string
    /** The signed-in user's email. */
    email?: string
}

/**
 * Header panel for authenticated users: avatar, truncated username, email,
 * and a notification bell badge.
 *
 * @param props - {@link UserSummaryProps}
 */
export const _UserSummary = ({ truncatedUsername, avatar, avatarSeed, username, email, className }: UserSummaryProps) => (
    <div className={cn("flex items-center justify-between gap-6", className)}>
        <div className="flex items-center gap-2">
            <UserAvatar
                className="cursor-pointer"
                username={username}
                avatar={avatar}
                seed={avatarSeed}
            />
            <div className="flex flex-col gap-0">
                <div className="text-sm">
                    {truncatedUsername}
                </div>
                <div className="text-xs text-muted">{email}</div>
            </div>
        </div>
        <Badge size="sm" className="border-0" content="0" color="accent">
            <BellIcon className="size-6 text-divider" />
        </Badge>
    </div>
)
