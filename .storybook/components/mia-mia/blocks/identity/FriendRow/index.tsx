"use client"

import React from "react"
import Link from "next/link"
import { Button, Spinner, Typography, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"

/** Props for {@link FriendRow}. */
export interface FriendRowProps extends WithClassNames<undefined> {
    /** Account username; drives the avatar fallback and the `@handle` default. */
    username: string
    /** Human-friendly name shown as the primary (linked) label; falls back to {@link FriendRowProps.username}. */
    displayName?: string | null
    /** Uploaded avatar URL; resilient fallbacks are handled by {@link UserAvatar}. */
    avatar?: string | null
    /** Secondary handle line (e.g. `@username`); hidden when omitted. */
    handle?: string
    /** Route the NAME links to — typically the user's public profile. */
    profileHref: string
    /** Presence dot: green when online, muted grey when offline. */
    isOnline?: boolean
    /** Accessible label for the presence dot when online. */
    onlineLabel?: string
    /** Accessible label for the presence dot when offline. */
    offlineLabel?: string
    /** Whether the viewer already follows this person; flips the action button. */
    isFollowing: boolean
    /** In-flight state for the follow toggle; shows an inline spinner. */
    isPending?: boolean
    /** Button copy for the "not yet following" state (e.g. "Kết bạn"). */
    followLabel: string
    /** Button copy for the "already following" state (e.g. "Đã kết bạn"). */
    followingLabel: string
    /** Fired when the action button is pressed; the caller owns the follow mutation. */
    onToggleFollow: () => void
}

/**
 * Presentational friend/suggestion row: an avatar with a presence dot, a name that
 * links to the person's profile, an optional `@handle`, and a right-aligned
 * follow/unfollow action button. Pure and props-only — no store, no fetch. The
 * caller supplies the follow state and owns the mutation via
 * {@link FriendRowProps.onToggleFollow}; presence + copy are passed in so the block
 * stays store-free and locale-agnostic.
 *
 * Mirrors {@link import("@/components/composites/lists/UserCell").UserCell}'s
 * avatar+name layout but adds a linkable name and a presence dot, which UserCell
 * cannot express (its name is plain text and it has no presence slot).
 *
 * @param props - {@link FriendRowProps}
 *
 * @see Story: .storybook/stories/mia-mia/FriendRow/FriendRow.stories
 */
export const FriendRow = ({
    username,
    displayName,
    avatar,
    handle,
    profileHref,
    isOnline = false,
    onlineLabel,
    offlineLabel,
    isFollowing,
    isPending = false,
    followLabel,
    followingLabel,
    onToggleFollow,
    className,
}: FriendRowProps) => {
    const name = displayName ?? username

    return (
        <div className={cn("flex min-w-0 items-center gap-2", className)}>
            {/* Avatar + presence dot */}
            <div className="relative shrink-0">
                <UserAvatar username={username} avatar={avatar} seed={username} size="sm" />
                <span
                    aria-label={isOnline ? onlineLabel : offlineLabel}
                    className={cn(
                        "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface",
                        isOnline ? "bg-success" : "bg-muted",
                    )}
                />
            </div>

            {/* Linked name + optional handle */}
            <div className="flex min-w-0 flex-col gap-0">
                <Link href={profileHref} className="min-w-0">
                    <Typography
                        type="body-sm"
                        weight="medium"
                        truncate
                        className="leading-5 hover:underline"
                    >
                        {name}
                    </Typography>
                </Link>
                {handle ? (
                    <Typography type="body-xs" color="muted" truncate className="leading-4">
                        {handle}
                    </Typography>
                ) : null}
            </div>

            {/* Follow / unfollow action */}
            <div className="ml-auto shrink-0">
                <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "primary"}
                    isPending={isPending}
                    onPress={onToggleFollow}
                >
                    {isPending ? (
                        // isPending does NOT render its own spinner in this HeroUI build —
                        // supply one by hand so the button reads as busy.
                        <span className="inline-flex items-center gap-2">
                            <Spinner size="sm" color="current" />
                            {isFollowing ? followingLabel : followLabel}
                        </span>
                    ) : isFollowing ? (
                        followingLabel
                    ) : (
                        followLabel
                    )}
                </Button>
            </div>
        </div>
    )
}
