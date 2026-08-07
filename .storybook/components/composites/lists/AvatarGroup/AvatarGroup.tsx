import { cn } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import type { AvatarSize, IconComponent } from "@sb-components/atoms/display/Avatar/Avatar"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "AvatarGroup" } as const

/**
 * `AvatarGroup` — a row of edge-overlapping avatars ("who follows") plus a "+N" chip. Leaves:
 * `Default` (items mapping), `Overflow` (`max` and `total`, both producing the "+N" chip),
 * `Sizes` (cluster-level `size`), and the `isSkeleton` mirror. Per-avatar state
 * (status/colors/fallback) lives in `Avatar`; `AvatarGroup` imports `Avatar` to build each one.
 */

/** One avatar in an {@link AvatarGroup} row. */
export interface AvatarGroupItem {
    /** Stable key for the list. */
    key: string
    /** Uploaded image URL. Absent → generated (DiceBear) avatar, then initials/icon. */
    src?: string
    /** Stable identity to seed the generated avatar (email/username). Falls back to `name`. */
    seed?: string
    /** Display name: image `alt` + the initials fallback. */
    name?: string
    /** Fallback glyph as a COMPONENT reference (only reached once `fallback` allows it). */
    icon?: IconComponent
}

/** Props for {@link AvatarGroup}. */
export interface AvatarGroupProps {
    /** Avatars in display order. */
    items: Array<AvatarGroupItem>
    /** How many avatars to show before the "+N" overflow chip. Default `5`. */
    max?: number
    /**
     * Real total the row stands for — drives "+N" when the caller only loaded the
     * first page of members. Defaults to `items.length`.
     */
    total?: number
    /** Size preset for EVERY avatar in the row (cluster-level). Default `sm`. */
    size?: AvatarSize
    /** Render the row skeleton — each visible slot mirrors as a circle shimmer. */
    isSkeleton?: boolean
}

/** Ring that separates one overlapping avatar from the one beneath it. */
const GROUP_RING = "rounded-full ring-2 ring-background"

/**
 * Overlapping avatar row with an optional "+N" overflow chip.
 *
 * @param props - {@link AvatarGroupProps}
 */
export const AvatarGroup = ({
    items,
    max = 5,
    total,
    size = "sm",
    isSkeleton = false,
    
}: AvatarGroupProps) => {
    const visible = items.slice(0, max)
    const extra = Math.max((total ?? items.length) - visible.length, 0)

    return (
        <div
            className={cn("flex -space-x-2")}
            data-tier="composite"
            data-component="AvatarGroup"
        >
            {visible.map((item) => (
                // One badge per member: names each avatar as one opaque part
                // instead of exposing Avatar's own Image/Fallback parts.
                <span key={item.key} className={cn("inline-flex", GROUP_RING)}>
                    <Avatar
                        src={item.src}
                        seed={item.seed}
                        name={item.name}
                        icon={item.icon}
                        size={size}
                        isSkeleton={isSkeleton}
                    />
                </span>
            ))}
            {extra > 0 ? (
                isSkeleton ? (
                    // While skeleton, the "+N" chip mirrors as a shimmer too — showing
                    // a real count inside a loading row would leak real data into fake state.
                    // Forwards to the same `Avatar` atom the visible items use above: the
                    // count/person distinction only matters once real content lands.
                    <span className={cn("inline-flex", GROUP_RING)}>
                        <Avatar isSkeleton size={size} />
                    </span>
                ) : (
                    // "+N" is a COUNT, not a person — house `Avatar.exactLabel` renders the
                    // full string (no 2-char initials slice).
                    <span className={cn("inline-flex", GROUP_RING)}>
                        <Avatar size={size} exactLabel={`+${extra}`} />
                    </span>
                )
            ) : null}
        </div>
    )
}
