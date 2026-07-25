import type { ReactNode } from "react"
import { Badge as HeroBadge, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Badge.Base`: the ONE constrained badge atom over HeroUI Badge.
 *
 * Gom mọi biến thể badge vào MỘT atom, phân biệt bằng PROP (leaf = composition):
 *   • đếm số               → `<Badge.Base count={3}>{icon}</Badge.Base>`
 *   • chấm (dot)            → `<Badge.Base dot>{icon}</Badge.Base>`
 *   • cap ("99+")           → `<Badge.Base count={128} max={99}>{icon}</Badge.Base>`
 *   • đứng riêng (no anchor) → `<Badge.Base count={5} />`
 *
 * Khi có `children` → atom bọc trong HeroUI `Badge.Anchor` (badge treo góc phần tử);
 * không có → badge inline độc lập. Atom tự cap số theo `max` (§4), tự vẽ leaf
 * skeleton (`isSkeleton`). `count <= 0` (không `showZero`, không `dot`) → ẩn badge,
 * chỉ render anchor content.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
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
    showAnatomy = false,
    className,
}: BadgeBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — a dot when `dot`, else a short count pill.
        return (
            <HeroSkeleton
                className={cn(dot ? "size-2.5 rounded-full" : "h-4 w-6 rounded-full", className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }

    // A count of 0 hides the badge entirely (unless showZero) — no anchor decoration for "nothing".
    const hidden = !dot && count !== undefined && count <= 0 && !showZero
    const label = dot ? undefined : max !== undefined && count !== undefined && count > max ? `${max}+` : count

    const badge = hidden ? null : (
        <HeroBadge
            color={color}
            size={size}
            placement={placement}
            className={cn(dot && "min-w-0 p-0", !children && "static", className)}
            data-anat-part={showAnatomy ? "Badge" : undefined}
        >
            {label}
        </HeroBadge>
    )

    if (!children) {
        // Standalone: no anchor wrapper, the badge sits inline in normal flow.
        return badge
    }
    return (
        <HeroBadge.Anchor data-anat-part={showAnatomy ? "Anchor" : undefined}>
            <span data-anat-part={showAnatomy ? "Content" : undefined} className="inline-flex">
                {children}
            </span>
            {badge}
        </HeroBadge.Anchor>
    )
}

/**
 * `Badge.*` — the badge ATOM namespace. `Badge.Base` is the single constrained
 * badge; count / dot / cap / standalone are LEAVES of it (prop-driven).
 */
export const Badge = {
    Base: BadgeBase,
}
