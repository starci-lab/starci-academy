import React from "react"
import { cn } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { IconTile, type IconComponent, type IconTileTone } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { Box } from "@sb-components/frames/Box/Box"

/**
 * `UserCell` — the system's one person row: avatar + name + optional `@handle`. Leaves: `size`,
 * `handle`, `trailing`, `leadingIcon`, `isOwnRow`, `isSkeleton`. `leadingIcon`/`leadingTone` let
 * the row lead with a framed `IconTile` instead of `Avatar`, for rows that aren't a person
 * (a course/org/resource). `avatar` swaps the image inside `Avatar`; `username`/`displayName`
 * are the content each leaf fills in. Deps `Avatar` and `Typography` link to their own stories.
 */

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
    /**
     * Optional icon COMPONENT that swaps the leading {@link Avatar} for a framed
     * {@link IconTile} — for rows led by a course/org/resource glyph instead of a
     * person (e.g. a leaderboard row for a team, or a "posted in `<course>`"
     * byline). Additive: omitted (default), the cell renders `Avatar` exactly as
     * before — every other prop keeps its current meaning. Always rendered at
     * `IconTile`'s `"sm"` step (40px) regardless of {@link UserCellProps.size},
     * matching the pairing already used for an icon-led row elsewhere in the
     * house (`FoundationResourceList`, `LeaderboardBoard`) — `IconTile`'s size
     * steps (40/64/80) don't line up with `Avatar`'s (32/40/48), so this is the
     * one step common to both without an untested oversize tile in a name row.
     */
    leadingIcon?: IconComponent
    /**
     * Tinted background + icon colour for {@link UserCellProps.leadingIcon}.
     * Ignored unless `leadingIcon` is set. Defaults to `"accent"`.
     */
    leadingTone?: IconTileTone
    /**
     * Optional right-aligned slot, e.g. a follow button or status chip. A
     * COMPONENT reference (COMPOSITE-8): the cell calls it itself and forwards
     * `isSkeleton`, so the slot can shimmer in place instead of vanishing
     * during loading and jumping the row's width back once data lands.
     */
    trailing?: ComponentTypeWithSkeleton
    /**
     * `true` when this row belongs to the viewer — tints the name accent so it
     * stands out in a list (e.g. a leaderboard or comment thread).
     */
    isOwnRow?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * Render the leaf skeleton (shimmer) instead of the cell. Every shimmer is
     * delegated to the atom it stands for — `Avatar isSkeleton size={size}` for
     * the circle, `Typography isSkeleton` for the name/handle bars — so none of
     * them drifts from that atom's own resting shape (COMPOSITE-10: this
     * composite decides WHICH parts shimmer and HOW MANY, never draws one itself).
     */
    isSkeleton?: boolean
}

/**
 * Presentational person cell: avatar + name + optional `@handle`, with an optional
 * right-aligned trailing slot. Pure and props-only — no store or data access; the
 * caller supplies all text and any interactive controls via {@link UserCellProps.trailing}.
 *
 * Composes the {@link Avatar} and {@link Typography} atoms — an avatar with a
 * name/handle beside it is an identity pairing, which is why this lives at the
 * composite tier instead of atom. The text column truncates so the cell
 * survives narrow containers (`min-w-0`).
 *
 * @param props - {@link UserCellProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "UserCell" } as const

const UserCellBase = ({
    username,
    displayName,
    avatar,
    handle,
    size = "sm",
    trailing: Trailing,
    leadingIcon: LeadingIcon,
    leadingTone = "accent",
    classNames,
    isOwnRow = false,
    isSkeleton = false,
}: UserCellProps) => {
    const name = displayName ?? username

    // `trailing` is free content the caller's component builds, not part of
    // UserCell's own anatomy, so it stays unbadged. Called in BOTH states
    // (COMPOSITE-8) — forwarding `isSkeleton` lets it shimmer in place instead
    // of vanishing during loading and jumping the row's width once data lands.
    const trailingSlot = Trailing ? (
        <Box principles={["push-end"]} className="shrink-0">
            <Trailing isSkeleton={isSkeleton} />
        </Box>
    ) : null

    if (isSkeleton) {
        // Every shimmer is the atom's own: the avatar circle delegates to `Avatar
        // isSkeleton size={size}` so it matches this row's size, and the name/handle
        // bars delegate to `Typography isSkeleton` so their line box tracks that
        // atom's own type scale — nothing here draws a bar by hand (COMPOSITE-10).
        return (
            <div
                data-tier="composite"
                data-component="UserCell"

                className={cn("flex min-w-0 items-center gap-2", classNames)}
            >
                {LeadingIcon ? (
                    <IconTile isSkeleton size="sm" />
                ) : (
                    <Avatar isSkeleton size={size} />
                )}
                <div className="flex min-w-0 flex-col gap-0">
                    <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
                    {handle ? (
                        <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
                    ) : null}
                </div>
                {trailingSlot}
            </div>
        )
    }

    return (
        <div
            data-tier="composite"
            data-component="UserCell"

            className={cn("flex min-w-0 items-center gap-2", classNames)}
        >
            {LeadingIcon ? (
                <IconTile
                    icon={LeadingIcon}
                    tone={leadingTone}
                    size="sm"

                />
            ) : (
                <Avatar
                    name={username}
                    src={avatar ?? undefined}
                    seed={username}
                    size={size}

                />
            )}
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
            {trailingSlot}
        </div>
    )
}

/** `UserCell.*` — presentational identity cell (avatar + name + optional handle/trailing). */
export { UserCellBase as UserCell }
