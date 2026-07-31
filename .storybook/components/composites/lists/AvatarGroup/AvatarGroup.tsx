import { Avatar as HeroAvatar, AvatarFallback as HeroAvatarFallback, cn } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import type { AvatarSize, IconComponent } from "@sb-components/atoms/display/Avatar/Avatar"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `AvatarGroup` — an overlapping row of avatars ("who follows"), each
 * ringed, with a "+N" chip for the overflow.
 *
 * The only component in the Avatar family with dependencies of its own — it
 * imports `Avatar`.
 *
 *   • `items` is DATA, not `children`; the composite builds each `Avatar` itself.
 *   • `size` is set at the GROUP level (the row is always one size); items
 *     do not carry their own size.
 *   • `isSkeleton` passes down so each item mirrors it, keeping the row's footprint stable.
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
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    showAnatomy = false,
    className,
    classNames,
}: AvatarGroupProps) => {
    const visible = items.slice(0, max)
    const extra = Math.max((total ?? items.length) - visible.length, 0)

    return (
        <div className={cn("flex -space-x-2", className, classNames)}>
            {visible.map((item) => (
                // One badge per member: names each avatar as one opaque part
                // instead of exposing Avatar's own Image/Fallback parts.
                <span key={item.key} className="inline-flex" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                    <Avatar
                        src={item.src}
                        seed={item.seed}
                        name={item.name}
                        icon={item.icon}
                        size={size}
                        isSkeleton={isSkeleton}
                        className={GROUP_RING}
                    />
                </span>
            ))}
            {extra > 0 ? (
                isSkeleton ? (
                    // While skeleton, the "+N" chip mirrors as a shimmer too — showing
                    // a real count inside a loading row would leak real data into fake state.
                    // Forwards to the same `Avatar` atom the visible items use above: the
                    // count/person distinction only matters once real content lands.
                    <span className="inline-flex" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                        <Avatar isSkeleton size={size} className={GROUP_RING} />
                    </span>
                ) : (
                    // "+N" is a COUNT, not a person — rendered here rather than through
                    // Avatar, whose initials fallback would clip "+12" to "+1".
                    <HeroAvatar size={size} className={GROUP_RING} data-anat-part={showAnatomy ? "HeroAvatar" : undefined}>
                        <HeroAvatarFallback>+{extra}</HeroAvatarFallback>
                    </HeroAvatar>
                )
            ) : null}
        </div>
    )
}
