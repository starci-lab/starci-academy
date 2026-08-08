import type { ReactNode } from "react"
import { Badge as HeroBadge, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ATOM — `Badge`: wraps HeroUI `Badge` directly (+ `Badge.Anchor` when it has
 * `children`). A leaf atom — it composes none of our own storied atoms, so it has no
 * atom-tier deps; `Content` is an internal slot for free-form `children`, not a dep.
 * `Badge`/`Badge.Anchor`/`Skeleton` are direct `@heroui/react` renders (`tier:
 * "heroui"`), and `Badge` is a valid atom-wrapper holding `children`.
 *
 * Uses the `states[]` API: each prop value (`count`/`dot`/`max` for `Anchored`, each
 * tone for `Colors`, each size for `Sizes`, each corner for `Placement`) is its own
 * state, so the deps tree and code snippet belong to it alone.
 */

/** Badge tone (HeroUI Badge `color`). */
export type BadgeColor = "accent" | "danger" | "default" | "success" | "warning"

/** Corner the badge anchors to on its child. */
export type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left"

/** Props for {@link BadgeBase}. */
export interface BadgeBaseProps {
    /** Element the badge anchors to (icon / avatar). Absent → the badge renders inline, standalone. */
    children?: ReactNode
    /** Numeric count. Rendered verbatim until it exceeds {@link BadgeBaseProps.max}. Ignored when `dot`. */
    count?: number
    /** Cap: counts above this render as `"{max}+"` (e.g. `99` → `"99+"`). */
    max?: number
    /** Render a bare dot (no number) — a presence/unread signal. */
    dot?: boolean
    /** Keep the badge visible at `count === 0`. Default `false` (zero hides the badge). */
    showZero?: boolean
    /** Badge tone. Default `danger` (the usual unread/alert colour). */
    color?: BadgeColor
    /** Badge size. Default `md`. */
    size?: "sm" | "md" | "lg"
    /** Anchor corner (only meaningful with `children`). Default `top-right`. */
    placement?: BadgePlacement
    /** Render the leaf skeleton (a small pill/dot shimmer) instead of the badge. */
    isSkeleton?: boolean
}

/**
 * The base badge atom. See file header for the anchor/standalone + cap contract.
 *
 * @param props - {@link BadgeBaseProps}
 */
const BadgeBase = ({
    children,
    count,
    max,
    dot = false,
    showZero = false,
    color = "danger",
    size = "md",
    placement = "top-right",
    isSkeleton = false,
}: BadgeBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton: a dot shimmer when `dot`, otherwise a short count pill.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="Badge"
                className={cn(dot ? "size-2.5 rounded-full" : "h-4 w-6 rounded-full")}

            />
        )
    }

    // A count of 0 hides the badge entirely (unless showZero) — no anchor decoration for "nothing".
    const hidden = !dot && count !== undefined && count <= 0 && !showZero
    const label = dot ? undefined : max !== undefined && count !== undefined && count > max ? `${max}+` : count

    const badge = hidden ? null : (
        <HeroBadge
            // Root marker only when this IS the root — with `children`, `Badge.Anchor`
            // below is the root instead, and this element becomes its nested part.
            data-tier={!children ? "atom" : undefined}
            data-component={!children ? "Badge" : undefined}
            color={color}
            size={size}
            placement={placement}
            className={cn(dot && "min-w-0 p-0", !children && "static")}

        >
            {label}
        </HeroBadge>
    )

    if (!children) {
        // Standalone: no anchor wrapper, the badge sits inline in normal flow.
        return badge
    }
    return (
        <HeroBadge.Anchor data-tier="atom" data-component="Badge">
            {/* Caller slot — `children` belongs to whoever anchors on this badge,
                not to Badge's own anatomy, so this wrapper stays unbadged. */}
            <span className="inline-flex">
                {children}
            </span>
            {badge}
        </HeroBadge.Anchor>
    )
}

/**
 * `Badge.*` — the badge ATOM namespace. `Badge` is the single constrained
 * badge; count / dot / cap / standalone are LEAVES of it (prop-driven).
 */
export { BadgeBase as Badge }

/** Tier metadata for `Badge`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Badge" } as const
