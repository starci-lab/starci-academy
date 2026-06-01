"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage, cn } from "@heroui/react"

/** Props for {@link UserAvatar}. */
export interface UserAvatarProps {
    /** Display username; drives the initials fallback + image alt text. */
    username?: string | null
    /** Avatar image URL; falls back to initials when missing or it fails to load. */
    avatar?: string | null
    /** HeroUI avatar size preset. */
    size?: "sm" | "md" | "lg"
    /** Extra classes on the avatar root. */
    className?: string
}

/**
 * Shared user avatar: renders the user's image when present, otherwise the first two
 * letters of their username as an initials fallback (mirrors the navbar account avatar).
 *
 * Presentational: no hooks/state; safe to use anywhere a user face is shown.
 * @param props - {@link UserAvatarProps}
 */
export const UserAvatar = ({ username, avatar, size, className }: UserAvatarProps) => {
    // first two letters, upper-cased — the fallback shown while/if the image is unavailable
    const initials = (username ?? "").slice(0, 2).toUpperCase()
    return (
        <Avatar size={size} className={cn(className)}>
            {/* image is attempted first; Radix swaps to the fallback on miss/error */}
            {avatar ? <AvatarImage src={avatar} alt={username ?? ""} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    )
}
