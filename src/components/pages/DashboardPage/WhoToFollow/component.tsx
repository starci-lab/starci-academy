import React from "react"
import Link from "next/link"
import {
    UserPlusIcon,
} from "@phosphor-icons/react"
import {
    FollowButton,
} from "@/components/blocks/community/FollowButton"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { Chip } from "@/components/atoms/chips/Chip"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackV, StackH } from "@/components/frames/Stack"

/** Placeholder row count shown while the first suggestion load is in flight. */
const SKELETON_ROW_COUNT = 4

/** One suggested-user row, already resolved by the connected `index.tsx`. */
export interface WhoToFollowUserItem {
    /** Stable identity; also the id forwarded to {@link WhoToFollowProps.onFollow}. */
    globalId: string
    /** Account username; drives the avatar fallback and the profile link target. */
    username: string
    /** Human-friendly name; `UserCell` falls back to {@link WhoToFollowUserItem.username}. */
    displayName?: string
    /** Uploaded avatar URL, resolved fallbacks handled by `UserCell`. */
    avatar?: string | null
    /** True → the row shows the "open to work" badge. */
    openToWork: boolean
    /** Fully-resolved, locale-aware link to this user's public profile. */
    profileHref: string
    /** True once the viewer has followed this user from this card (optimistic). */
    following: boolean
    /** True while this row's own follow request is in flight. */
    isPending: boolean
}

/** Props for {@link _WhoToFollow}. */
export interface WhoToFollowProps {
    /** Card title (already translated). */
    title: string
    /** "Open to work" badge label (already translated). */
    openToWorkLabel: string
    /** Suggested users, in display order. */
    users: ReadonlyArray<WhoToFollowUserItem>
    /** Follow a suggested user; the connected half owns the mutation and the optimistic state. */
    onFollow: (globalId: string) => void
    /** True on the first load, nothing to show yet. */
    isSkeleton?: boolean
    /** True once loaded with no suggestions at all. */
    isEmpty?: boolean
}

/** Props for the row {@link WhoToFollowRow} draws, real or shimmering. */
interface WhoToFollowRowProps {
    /** Resolved row data; omitted while {@link WhoToFollowRowProps.isSkeleton}. */
    user?: WhoToFollowUserItem
    /** "Open to work" badge label (already translated). */
    openToWorkLabel: string
    /** Follow a suggested user. */
    onFollow: (globalId: string) => void
    /** True → render the shimmer mirror instead of the live row. */
    isSkeleton?: boolean
}

/**
 * One suggestion row: [avatar · name + @handle (+ open-to-work badge)] on the
 * left, the follow toggle on the right. Mirrors its own shimmer through the
 * house `Skeleton.UserCell` / `Skeleton.Button` pieces so the row never jumps
 * when the real data arrives.
 */
const WhoToFollowRow = ({
    user,
    openToWorkLabel,
    onFollow,
    isSkeleton = false,
}: WhoToFollowRowProps) => (
    <StackH
        gap={4}
        padding={{ x: 3, y: 2 }}
        items={[
            () => (isSkeleton || !user ? (
                <Skeleton.UserCell className="min-w-0 flex-1" />
            ) : (
                <Link href={user.profileHref} className="min-w-0 flex-1">
                    <UserCell
                        username={user.username}
                        displayName={user.displayName}
                        avatar={user.avatar}
                        handle={`@${user.username}`}
                        trailing={user.openToWork ? (
                            <Chip tone="success" text={openToWorkLabel} />
                        ) : undefined}
                    />
                </Link>
            )),
            () => (isSkeleton || !user ? (
                <Skeleton.Button className="shrink-0" />
            ) : (
                <FollowButton
                    className="shrink-0"
                    following={user.following}
                    isPending={user.isPending}
                    onToggle={() => {
                        // already followed from this card → no-op
                        if (!user.following) {
                            onFollow(user.globalId)
                        }
                    }}
                />
            )),
        ]}
    />
)

/**
 * `_WhoToFollow` — the presentational half of `WhoToFollow` (see `./index.tsx`
 * for the connected half). Right-rail "who to follow" card listing users the
 * backend suggests, so the social graph keeps growing from the home surface.
 * Each row links to the user's public profile and carries a follow button that
 * fires {@link WhoToFollowProps.onFollow} (the connected half owns the
 * `setFollow` mutation and the optimistic "following" state).
 *
 * Renders ONE tree: `isSkeleton` threads straight down to `WhoToFollowRow`,
 * which shimmers via `Skeleton.UserCell` / `Skeleton.Button` instead of
 * building a second layout to keep in sync. Hides entirely once loaded with
 * nothing to suggest — same as before the split, no visible empty state.
 *
 * @param props - {@link WhoToFollowProps}
 */
export const _WhoToFollow = ({
    title,
    openToWorkLabel,
    users,
    onFollow,
    isSkeleton = false,
    isEmpty = false,
}: WhoToFollowProps) => {
    if (!isSkeleton && isEmpty) {
        return null
    }

    const rows = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, () => () => (
            <WhoToFollowRow openToWorkLabel={openToWorkLabel} onFollow={onFollow} isSkeleton />
        ))
        : users.map((user) => () => (
            <WhoToFollowRow user={user} openToWorkLabel={openToWorkLabel} onFollow={onFollow} />
        ))

    return (
        <SectionCard
            icon={<UserPlusIcon className="size-5 text-accent-soft-foreground" />}
            title={title}
        >
            <StackV gap={3} items={rows} />
        </SectionCard>
    )
}
