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
 * RESPONSIVE COLLAPSE also lives here (the `ResponsiveBreadcrumb` scaffold
 * removed 2026-07-25 — §13c "atom wears the coat"): a narrow column can't hold a trail, and a
 * deep trail wraps and eats vertical space, so the atom can swap the WHOLE trail
 * for a single back affordance ("← Back") pointing at the deepest pressable
 * ancestor:
 *   • `collapseOnMobile` → back link below `@app-sm`, trail from `@app-sm` up.
 *   • `collapseFrom={n}` → back link at EVERY width once the trail has ≥ n crumbs.
 * The back link is a LEAF of this atom (inline HeroUI `Link` + Phosphor
 * `ArrowLeftIcon`) — an atom is the bottom tier and must not import `blocks/`,
 * so it does NOT reuse the `BackLink` block.
 *
 * Rules (Chip/Input):
 *   • NAMESPACE required — export ONLY `Breadcrumbs = { Base }`, no bare
 *     component exported (teacher finalized 2026-07-25).
 *   • NO `children` — crumbs pass through `items` data; `label` is a
 *     `ReactNode` prop (the label), not children.
 *   • Wrap HeroUI to the MAX (`Breadcrumbs`), alias `Hero*`.
 *   • STRICT §4: `items` + per-item `onPress` TRẦN — the atom owns separators,
 *     truncation, current-crumb styling; the consumer never touches structure.
 *   • `isSkeleton` → trail skeleton co-located (HeroSkeleton, hybrid C); shape
 *     follows `collapseFrom`/`collapseOnMobile` (bar-row vs back-link vs both,
 *     responsive) — fixed 2026-07-27, see prop doc below.
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
    /** Label of the collapsed back link. Default `"Back"`. */
    backLabel?: string
    /**
     * Render the trail shimmer instead of the crumbs. Shape follows
     * `collapseFrom`/`collapseOnMobile` + trail depth — a back-link shimmer when
     * the config resolves to the collapsed form, bar-row shimmer otherwise — so
     * the loading shape matches what the real trail is about to become.
     */
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
    backLabel = "Back",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: BreadcrumbsBaseProps) => {
    if (isSkeleton) {
        // Collapse shape is STRUCTURAL — driven by `collapseFrom`/`collapseOnMobile`
        // (caller config) + trail depth, both known BEFORE crumb text loads. The
        // shimmer must pick the same shape the real trail resolves to; a bar-row
        // shimmer in front of a back-link real render is a layout jump when data
        // lands, the same bug class fixed on `Button.Base` (§12g: skeleton must
        // track every known-ahead axis, not one fixed shape for every config).
        // `items.length` stands in for "has a navigable ancestor" since skeleton
        // items rarely carry real `onPress` yet.
        const canCollapse = items.length > 1
        const isLongTrail = collapseFrom !== undefined && items.length >= collapseFrom
        const collapseAlways = canCollapse && isLongTrail
        const collapseMobile = canCollapse && collapseOnMobile && !collapseAlways

        const trailBars = (
            <div className={cn("flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="h-4 w-14 rounded-md" />
                <HeroSkeleton className="h-4 w-16 rounded-md" />
                <HeroSkeleton className="h-4 w-20 rounded-md" />
            </div>
        )
        const backBar = (
            <div className={cn("flex w-fit items-center gap-2", className)} data-anat-part={showAnatomy ? "SkeletonBack" : undefined}>
                <HeroSkeleton className="size-3.5 rounded-full" />
                <HeroSkeleton className="h-4 w-12 rounded-md" />
            </div>
        )

        if (collapseAlways) {
            return backBar
        }
        if (collapseMobile) {
            return (
                <>
                    <div className="hidden @app-sm:flex">{trailBars}</div>
                    <div className="@app-sm:hidden">{backBar}</div>
                </>
            )
        }
        return trailBars
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
              Arrow slides left on hover (§5b — arrow = action icon); the Phosphor
              glyph sits at `size-3.5` to match `text-sm`, smaller than `size-5` so
              it needs `weight="bold"` to compensate the stroke (§5.0a). Tailwind
              v4: `translate` is its own property → transition `[translate]`.
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
