import React from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { Avatar } from "@/components/atoms/display/Avatar/Avatar"
import { Typography } from "@/components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/** Ported from `@/components/blocks/identity/UserCell`. */

/** Props for {@link UserCell}. */
export interface UserCellProps {
    /** Account username; drives the avatar fallback and is the default display name. */
    username: string
    /** Human-friendly name shown as the primary label; falls back to {@link UserCellProps.username}. */
    displayName?: string
    /** Uploaded avatar URL; resilient fallbacks are handled by {@link Avatar}. */
    avatar?: string | null
    /** Secondary handle line (e.g. `@username`); hidden when omitted. */
    handle?: string
    /** Visual density of the row; controls the avatar preset. Defaults to `"sm"`. */
    size?: "sm" | "md"
    /** Optional right-aligned slot, e.g. a follow button or status chip. */
    trailing?: React.ReactNode
    /**
     * `true` when this row belongs to the viewer — tints the name accent so it
     * stands out in a list (e.g. a leaderboard or comment thread).
     */
    isOwnRow?: boolean
    /**
     * Placement utilities (e.g. `mb-4`).
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /**
     * Render the leaf skeleton (shimmer) instead of the cell. The avatar shimmer
     * delegates to `Avatar isSkeleton size={size}`, so it always matches this
     * row's size rather than a fixed size for every row.
     */
    isSkeleton?: boolean
}

/**
 * Presentational person cell: avatar + name + optional `@handle`, with an optional
 * right-aligned trailing slot. Pure and props-only — no store or data access; the
 * caller supplies all text and any interactive controls via {@link UserCellProps.trailing}.
 *
 * Composes the shared {@link Avatar} atom (`Avatar`) so the avatar fallback chain
 * (uploaded → generated → initials → icon) stays consistent everywhere a user is
 * rendered. The text column truncates so the cell survives narrow containers (`min-w-0`).
 *
 * @param props - {@link UserCellProps}
 */
const UserCellBase = ({
    username,
    displayName,
    avatar,
    handle,
    size = "sm",
    trailing,
    className,
    classNames,
    isOwnRow = false,
    isSkeleton = false,
}: UserCellProps) => {
    const name = displayName ?? username

    if (isSkeleton) {
        // Avatar delegates to `Avatar isSkeleton size={size}` so it matches this
        // row's size, plus a name bar and an optional handle bar gated on
        // `handle`, the same as the live branch below.
        return (
            <div className={cn("flex min-w-0 items-center gap-2", className, classNames)}>
                <Avatar isSkeleton size={size} />
                <div className="flex min-w-0 flex-col gap-0">
                    <HeroSkeleton
                        className="my-1 h-3 w-24 rounded"
                    />
                    {handle ? (
                        <HeroSkeleton
                            className="my-0 h-3 w-16 rounded"
                        />
                    ) : null}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex min-w-0 items-center gap-2", className, classNames)}>
            <Avatar
                name={username}
                src={avatar ?? undefined}
                seed={username}
                size={size}
            />
            <div className="flex min-w-0 flex-col gap-0">
                <Typography size="sm"
                    weight="medium"
                    color={isOwnRow ? "accent" : undefined}
                    truncate
                    text={name}
                />
                {handle ? (
                    <Typography size="xs"
                        color="muted"
                        truncate
                        text={handle}
                    />
                ) : null}
            </div>
            {trailing ? (
                <div className="ml-auto shrink-0">
                    {trailing}
                </div>
            ) : null}
        </div>
    )
}

/** `UserCell.*` — presentational person cell (avatar + name + optional handle/trailing). */
export { UserCellBase as UserCell }
