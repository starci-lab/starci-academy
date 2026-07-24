import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { UserAvatar } from "../../identity/UserAvatar/UserAvatar"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/ActivityAvatar`. Composed from the local primitive
 * `UserAvatar` (base avatar) + a small activity-type icon badge. Synced to `src` later.
 */

/** Props for the {@link ActivityAvatar} block. */
export interface ActivityAvatarProps {
    /** Main avatar's username — drives the image / initials fallback. */
    username: string
    /** Uploaded avatar URL (a generated default is used when missing). */
    avatar?: string | null
    /** Activity-type icon (phosphor `*Icon`) shown in the soft-accent badge. */
    icon: ReactNode
    /** Extra classes merged onto the root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each anatomy part for the BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Facebook-style feed avatar: a {@link UserAvatar} with a small activity-type icon
 * badge at the bottom-right. The badge is an OPAQUE soft-accent disc (a `bg-surface`
 * base under a `bg-accent-soft` tint so the avatar never bleeds through) with an
 * accent icon, and a surface ring cuts it cleanly from the avatar. Pure/props-only;
 * owns its look.
 *
 * @param props - {@link ActivityAvatarProps}
 */
export const ActivityAvatar = ({
    username,
    avatar,
    icon,
    className,
    anatPart,
    showAnatomy,
}: ActivityAvatarProps) => {
    return (
        <div className={cn("relative shrink-0", className)} data-anat-part={anatPart}>
            <UserAvatar
                className="size-9"
                username={username}
                avatar={avatar ?? undefined}
                seed={username}
                anatPart={showAnatomy ? "UserAvatar" : undefined}
            />
            <span
                aria-hidden
                className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-surface ring-2 ring-surface"
                data-anat-part={showAnatomy ? "Activity badge" : undefined}
            >
                <span className="flex size-full items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground [&_svg]:size-3">
                    {icon}
                </span>
            </span>
        </div>
    )
}
