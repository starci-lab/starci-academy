import React from "react"
import type { ReactNode } from "react"
import { Breadcrumbs as HeroBreadcrumbs, Link as HeroLink, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Breadcrumbs.Base`: the ONE constrained breadcrumb-trail atom over
 * HeroUI `Breadcrumbs`.
 *
 * Data-driven: the caller passes `items` (root → current), and the atom renders
 * `HeroBreadcrumbs > HeroBreadcrumbs.Item`. The last item is the current page
 * (usually without `onPress` → read-only). Truncation is a LEAF of the same atom
 * driven by `maxItems`: when the trail is longer, the middle collapses to a
 * single non-pressable "…" crumb (first + ellipsis + tail) — NOT a separate
 * component (§6 granularity).
 *
 * RESPONSIVE COLLAPSE also lives here (khung `ResponsiveBreadcrumb` xoá
 * 2026-07-25 — §13c "atom mặc áo"): a narrow column can't hold a trail, and a
 * deep trail wraps and eats vertical space, so the atom can swap the WHOLE trail
 * for a single back affordance ("← Trở lại") pointing at the deepest pressable
 * ancestor:
 *   • `collapseOnMobile` → back link below `@app-sm`, trail from `@app-sm` up.
 *   • `collapseFrom={n}` → back link at EVERY width once the trail has ≥ n crumbs.
 * The back link is a LEAF of this atom (inline HeroUI `Link` + Phosphor
 * `ArrowLeftIcon`) — an atom is the bottom tier and must not import `blocks/`,
 * so it does NOT reuse the `BackLink` block.
 *
 * Rules (Chip/Input):
 *   • NAMESPACE bắt buộc — chỉ export `Breadcrumbs = { Base }`, không export
 *     component trần (thầy chốt 2026-07-25).
 *   • KHÔNG `children` — crumb truyền qua `items` dữ liệu; `label` là prop
 *     `ReactNode` (nhãn), không phải children.
 *   • Bọc HeroUI TỐI ĐA (`Breadcrumbs`), alias `Hero*`.
 *   • STRICT §4: `items` + per-item `onPress` TRẦN — the atom owns separators,
 *     truncation, current-crumb styling; the consumer never touches structure.
 *   • `isSkeleton` → trail skeleton co-located (HeroSkeleton, hybrid C).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One crumb in a {@link BreadcrumbsBase} trail. */
export interface BreadcrumbItem {
    /** Stable key for the list. */
    key: string | number
    /** Crumb label. */
    label: ReactNode
    /** Navigate handler — omit on the current (last, read-only) crumb. */
    onPress?: () => void
}

/** Props for {@link BreadcrumbsBase}. */
export interface BreadcrumbsBaseProps {
    /** The full trail, root → current (current last, usually without `onPress`). */
    items: Array<BreadcrumbItem>
    /**
     * When the trail has MORE than this many crumbs, collapse the middle into a
     * single "…" crumb: `first › … › last two`. Omit to always show every crumb.
     */
    maxItems?: number
    /**
     * Below the `@app-sm` breakpoint, replace the whole trail with a single back
     * link to the deepest pressable ancestor (a narrow column can't hold a trail).
     * Ignored when no item has `onPress` — the trail then stays visible.
     */
    collapseOnMobile?: boolean
    /**
     * Once the trail has AT LEAST this many crumbs, replace it with the back link
     * at EVERY width — a long trail wraps and eats vertical space, and deep
     * ancestors are already reachable from top nav. Omit to never collapse by length.
     */
    collapseFrom?: number
    /** Label of the collapsed back link. Default `"Trở lại"`. */
    backLabel?: string
    /** Render the trail skeleton (a row of bar shimmers) instead of the crumbs. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/** The collapsed placeholder key (stable, never collides with a real crumb key). */
const ELLIPSIS_KEY = "__ellipsis__"

/**
 * The breadcrumb-trail atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link BreadcrumbsBaseProps}
 */
const BreadcrumbsBase = ({
    items,
    maxItems,
    collapseOnMobile = false,
    collapseFrom,
    backLabel = "Trở lại",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: BreadcrumbsBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — a few crumb-width bars.
        return (
            <div className={cn("flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="h-4 w-14 rounded-md" />
                <HeroSkeleton className="h-4 w-16 rounded-md" />
                <HeroSkeleton className="h-4 w-20 rounded-md" />
            </div>
        )
    }

    // Truncate: keep the first crumb + the last two, drop the middle behind a "…".
    const shouldTruncate = maxItems !== undefined && items.length > maxItems
    const rendered: Array<BreadcrumbItem | typeof ELLIPSIS_KEY> = shouldTruncate
        ? [items[0], ELLIPSIS_KEY, ...items.slice(-2)]
        : items

    // Back target = deepest ancestor we can navigate to (the current crumb has no onPress).
    const parent = [...items].reverse().find((item) => item.onPress)
    // Collapsing needs somewhere to go back TO; without it the trail always stays.
    const canCollapse = parent !== undefined
    const isLongTrail = collapseFrom !== undefined && items.length >= collapseFrom
    const collapseAlways = canCollapse && isLongTrail
    const collapseMobile = canCollapse && collapseOnMobile && !collapseAlways

    const trail = (
        <HeroBreadcrumbs
            data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}
            className={cn(collapseMobile && "hidden @app-sm:flex", className)}
        >
            {rendered.map((entry) =>
                entry === ELLIPSIS_KEY ? (
                    <HeroBreadcrumbs.Item key={ELLIPSIS_KEY} data-anat-part={showAnatomy ? "Ellipsis" : undefined}>
                        …
                    </HeroBreadcrumbs.Item>
                ) : (
                    <HeroBreadcrumbs.Item key={entry.key} onPress={entry.onPress} data-anat-part={showAnatomy ? "Crumb" : undefined}>
                        {entry.label}
                    </HeroBreadcrumbs.Item>
                ),
            )}
        </HeroBreadcrumbs>
    )

    if (!collapseAlways && !collapseMobile) {
        return trail
    }

    return (
        <>
            {collapseAlways ? null : trail}
            {/*
              Collapsed LEAF of this atom: one quiet back affordance, not a pill.
              Arrow slides left on hover (§5b — arrow = action icon); glyph Phosphor
              ở `size-3.5` cho khớp `text-sm`, nhỏ hơn `size-5` nên phải
              `weight="bold"` bù nét (§5.0a). Tailwind v4: `translate` là property
              riêng → transition `[translate]`.
            */}
            <HeroLink
                data-anat-part={showAnatomy ? "Back" : undefined}
                onPress={parent?.onPress}
                className={cn(
                    "group text-muted hover:text-foreground flex w-fit cursor-pointer items-center gap-2 text-sm no-underline transition-colors",
                    collapseMobile && "@app-sm:hidden",
                    className,
                )}
            >
                <ArrowLeftIcon
                    aria-hidden
                    focusable="false"
                    weight="bold"
                    className="size-3.5 transition-[translate] group-hover:-translate-x-1"
                />
                <span className="decoration-[var(--separator-tertiary)] underline-offset-4 group-hover:underline">
                    {backLabel}
                </span>
            </HeroLink>
        </>
    )
}

/**
 * `Breadcrumbs.*` — the breadcrumb ATOM namespace. `Breadcrumbs.Base` is the
 * single constrained trail; truncation (`maxItems`) and the responsive back-link
 * collapse (`collapseOnMobile` / `collapseFrom`) are LEAVES of it, prop-driven.
 */
export const Breadcrumbs = Object.assign(BreadcrumbsBase, {
    Base: BreadcrumbsBase,
})
