import React from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { UserAvatar } from "@sb-components/atoms/display/UserAvatar/UserAvatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/UserCell`. Authored in Storybook (not `src`);
 * synced to `src` later. Composes the local {@link UserAvatar} port (sibling
 * folder) instead of `@/components`.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for {@link UserCell}. */
export interface UserCellProps extends WithClassNames<undefined> {
    /** Account username; drives the avatar fallback and is the default display name. */
    username: string
    /** Human-friendly name shown as the primary label; falls back to {@link UserCellProps.username}. */
    displayName?: string
    /** Uploaded avatar URL; resilient fallbacks are handled by {@link UserAvatar}. */
    avatar?: string | null
    /** Secondary handle line (e.g. `@username`); hidden when omitted. */
    handle?: string
    /** Visual density of the row; controls the avatar preset. Defaults to `"sm"`. */
    size?: "sm" | "md"
    /** Optional right-aligned slot, e.g. a follow button or status chip. */
    trailing?: React.ReactNode
    /**
     * Extra classes on the NAME's own `Typography` (e.g. `text-accent` to mark the
     * viewer's own row) — applied last so it overrides Typography's default colour,
     * which a parent `text-*` can't reach through the component boundary.
     */
    nameClassName?: string
    /** When on, emit `data-anat-part` on this cell's own direct sub-parts (avatar · name · handle · trailing) so a `BlockAnatomy` panel can badge them. */
    showAnatomy?: boolean
    /**
     * Render the leaf skeleton (shimmer) instead of the cell — avatar `size-9` +
     * name/handle bars. Atom này là **BẢN GỐC DUY NHẤT** của hình đó (§12c — chủ
     * của HÌNH là chủ của SKELETON). Compound `Skeleton.*` đã XOÁ HẲN 2026-07-25.
     */
    isSkeleton?: boolean
}

/**
 * Presentational person cell: avatar + name + optional `@handle`, with an optional
 * right-aligned trailing slot. Pure and props-only — no store or data access; the
 * caller supplies all text and any interactive controls via {@link UserCellProps.trailing}.
 *
 * Composes the shared {@link UserAvatar} so the avatar fallback chain stays consistent
 * everywhere a user is rendered. The text column truncates so the cell survives narrow
 * containers (`min-w-0`).
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
    nameClassName,
    showAnatomy = false,
    isSkeleton = false,
}: UserCellProps) => {
    const name = displayName ?? username

    if (isSkeleton) {
        // Skeleton lá do CHÍNH atom này sở hữu (§12c) — đúng hộp: avatar size-9 +
        // name bar (h-3 w-24 my-1) + handle bar tuỳ chọn (h-3 w-16 my-0), gate theo
        // `handle` y như nhánh sống gate dòng đó.
        return (
            <div
                className={cn("flex min-w-0 items-center gap-2", className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            >
                <HeroSkeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-col gap-0">
                    <HeroSkeleton className="my-1 h-3 w-24 rounded" />
                    {handle ? <HeroSkeleton className="my-0 h-3 w-16 rounded" /> : null}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex min-w-0 items-center gap-2", className)}>
            <UserAvatar.Base
                username={username}
                avatar={avatar}
                seed={username}
                size={size}
                anatPart={showAnatomy ? "UserAvatar" : undefined}
            />
            <div className="flex min-w-0 flex-col gap-0">
                <Typography.Base size="sm"
                    weight="medium"
                    truncate
                    showAnatomy={showAnatomy}
                    className={cn("leading-5", nameClassName)}
                    text={name}
                />
                {handle ? (
                    <Typography.Base size="xs"
                        color="muted"
                        truncate
                        showAnatomy={showAnatomy}
                        className="leading-4"
                        text={handle}
                    />
                ) : null}
            </div>
            {trailing ? (
                <div data-anat-part={showAnatomy ? "Trailing" : undefined} className="ml-auto shrink-0">
                    {trailing}
                </div>
            ) : null}
        </div>
    )
}

/** `UserCell.*` — presentational person cell (avatar + name + optional handle/trailing). */
export const UserCell = Object.assign(UserCellBase, {
    Base: UserCellBase,
})
