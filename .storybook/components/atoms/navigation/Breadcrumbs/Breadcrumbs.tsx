import React from "react"
import type { ReactNode } from "react"
import { Breadcrumbs as HeroBreadcrumbs, Link as HeroLink, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Breadcrumbs` wraps HeroUI `Breadcrumbs` directly, composing no other atom with a
 * story. Every sub-part is a real `@heroui/react` import, so each declares `tier: "heroui"`
 * in `ANNOTATE`, named after the identifier it renders — `Breadcrumbs` (the trail) ·
 * `Breadcrumbs.Item` (one crumb or the "…" placeholder) · `Link` (the collapsed back
 * affordance) · `Skeleton` (a shimmer bar). No `storyId`.
 * 
 * The `Skeleton` leaf carries the prop's name (`isSkeleton`) and renders every
 * shape-bearing state known before data: `collapseFrom`/`collapseOnMobile` — plain trail
 * bars · back-link (trail about to collapse) · both responsive variants. The `isSkeleton`
 * branch computes `collapseAlways`/`collapseMobile` from `items.length` and picks the right
 * shape. `maxItems` (Truncated) needs no separate state — the bar count depends on the real
 * item count, unknown while loading.
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: BreadcrumbsBaseProps) => {
    if (isSkeleton) {
        // Collapse shape is known ahead of load (driven by `collapseFrom`/
        // `collapseOnMobile` + trail depth), so the shimmer must match the shape
        // the real trail resolves to — a mismatched shimmer causes a layout jump
        // once data lands. `items.length` stands in for "has a navigable
        // ancestor" since skeleton items rarely carry a real `onPress` yet.
        const canCollapse = items.length > 1
        const isLongTrail = collapseFrom !== undefined && items.length >= collapseFrom
        const collapseAlways = canCollapse && isLongTrail
        const collapseMobile = canCollapse && collapseOnMobile && !collapseAlways

        const trailBars = (
            <div data-tier="atom" data-component="Breadcrumbs" className={cn("flex items-center gap-2", classNames)}>
                <HeroSkeleton className="h-4 w-1/4 rounded-md" />
                <HeroSkeleton className="h-4 w-1/3 rounded-md" />
                <HeroSkeleton className="h-4 w-1/2 rounded-md" />
            </div>
        )
        const backBar = (
            <div data-tier="atom" data-component="Breadcrumbs" data-principle="icon-text" className={cn("flex w-fit items-center gap-1", classNames)}>
                <HeroSkeleton className="size-3.5 rounded-full" />
                <HeroSkeleton className="h-4 w-1/3 rounded-md" />
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
            data-tier="atom"
            data-component="Breadcrumbs"

            className={cn(collapseMobile && "hidden @app-sm:flex", classNames)}
        >
            {rendered.map((entry) =>
                entry === ELLIPSIS_KEY ? (
                    <HeroBreadcrumbs.Item key={ELLIPSIS_KEY}>
                        …
                    </HeroBreadcrumbs.Item>
                ) : (
                    <HeroBreadcrumbs.Item key={entry.key} onPress={entry.onPress}>
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
              A quiet back affordance, not a pill. Icon sized `size-3.5` to
              match `text-sm`; smaller than `size-5` so `weight="bold"`
              compensates the stroke. Tailwind v4 treats `translate` as its
              own property, so the transition must target `[translate]` —
              `transition-transform` won't animate it.
            */}
            <HeroLink
                data-tier="atom"
                data-component="Breadcrumbs"

                data-principle="icon-text"
                onPress={parent?.onPress}
                className={cn(
                    "group text-muted hover:text-foreground flex w-fit cursor-pointer items-center gap-1 text-sm no-underline transition-colors",
                    collapseMobile && "@app-sm:hidden",
                    classNames,
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
 * `Breadcrumbs.*` — the breadcrumb ATOM namespace. `Breadcrumbs` is the
 * single constrained trail; truncation (`maxItems`) and the responsive back-link
 * collapse (`collapseOnMobile` / `collapseFrom`) are LEAVES of it, prop-driven.
 */
export { BreadcrumbsBase as Breadcrumbs }

export const meta = { tier: "atom", name: "Breadcrumbs" } as const
