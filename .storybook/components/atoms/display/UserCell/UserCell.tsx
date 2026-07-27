import React from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/UserCell`. Authored in Storybook (not `src`);
 * synced to `src` later. Composes the shared {@link Avatar} atom (`Avatar`)
 * instead of the retired `UserAvatar` port — that port's DiceBear + broken-image
 * fallback chain merged into `Avatar` on 2026-07-26 (xem header của
 * `AvatarBase.tsx`), nên compose thẳng `Avatar` chứ không quay lại `UserAvatar`.
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
    /** Optional right-aligned slot, e.g. a follow button or status chip. */
    trailing?: React.ReactNode
    /**
     * `true` khi hàng này là của chính người đang xem — đổi tone tên sang accent để
     * mắt tự nhận ra "đây là mình" giữa danh sách (vd bảng xếp hạng, thread bình
     * luận). Prop NGỮ NGHĨA — atom tự chọn class, caller không truyền chuỗi thô (§4).
     */
    isOwnRow?: boolean
    className?: string
    /** When on, emit `data-anat-part` on this cell's own direct sub-parts (avatar · name · handle · trailing) so a `BlockAnatomy` panel can badge them. */
    showAnatomy?: boolean
    /**
     * Render the leaf skeleton (shimmer) instead of the cell. Atom này là **BẢN GỐC
     * DUY NHẤT** của hình đó (§12c — chủ của HÌNH là chủ của SKELETON): avatar
     * shimmer uỷ quyền thẳng cho `Avatar isSkeleton size={size}` nên luôn khớp
     * cỡ hàng thật, không khoá cứng một size cho mọi row.
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
    isOwnRow = false,
    showAnatomy = false,
    isSkeleton = false,
}: UserCellProps) => {
    const name = displayName ?? username

    if (isSkeleton) {
        // Skeleton lá do CHÍNH atom này sở hữu (§12c) — avatar uỷ quyền cho
        // `Avatar isSkeleton size={size}` (chủ hình = chủ skeleton, cỡ luôn
        // khớp hàng thật) + name bar (h-3 w-24 my-1) + handle bar tuỳ chọn
        // (h-3 w-16 my-0), gate theo `handle` y như nhánh sống gate dòng đó.
        return (
            <div className={cn("flex min-w-0 items-center gap-2", className)}>
                <Avatar isSkeleton size={size} showAnatomy={showAnatomy} />
                <div className="flex min-w-0 flex-col gap-0">
                    <HeroSkeleton
                        className="my-1 h-3 w-24 rounded"
                        data-anat-part={showAnatomy ? "Skeleton" : undefined}
                    />
                    {handle ? (
                        <HeroSkeleton
                            className="my-0 h-3 w-16 rounded"
                            data-anat-part={showAnatomy ? "Skeleton" : undefined}
                        />
                    ) : null}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex min-w-0 items-center gap-2", className)}>
            <Avatar
                name={username}
                src={avatar ?? undefined}
                seed={username}
                size={size}
                showAnatomy={showAnatomy}
            />
            <div className="flex min-w-0 flex-col gap-0">
                <Typography size="sm"
                    weight="medium"
                    color={isOwnRow ? "accent" : undefined}
                    truncate
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "Typography" : undefined}
                    className="leading-5"
                    text={name}
                />
                {handle ? (
                    <Typography size="xs"
                        color="muted"
                        truncate
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Typography" : undefined}
                        className="leading-4"
                        text={handle}
                    />
                ) : null}
            </div>
            {trailing ? (
                // Caller slot (§ LOAI 3) — `trailing` is free content the caller passed in,
                // not a fixed part of UserCell's own anatomy, so it stays unbadged.
                <div className="ml-auto shrink-0">
                    {trailing}
                </div>
            ) : null}
        </div>
    )
}

/** `UserCell.*` — presentational person cell (avatar + name + optional handle/trailing). */
export { UserCellBase as UserCell }
