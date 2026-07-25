import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { Tabs as HeroTabs, Badge as HeroBadge, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Tabs.Base`: the ONE constrained tab-strip atom over HeroUI `Tabs`.
 *
 * Data-driven (like `Chip.Base` is prop-driven): the caller passes `items`
 * (id + label + optional `icon`/`badge`/`isDisabled`) and the atom renders the
 * FULL HeroUI compound internally — `Tabs.ListContainer > Tabs.List > Tabs.Tab`
 * (+ `Tabs.Indicator`) plus the `sr-only` `Tabs.Panel`s react-aria needs to keep
 * the tab↔tabpanel ARIA relationship valid. Variants (icon / badge / disabled)
 * are LEAVES driven by per-item props, NOT separate components (§6 granularity).
 *
 * Rules (Chip/Input):
 *   • NAMESPACE bắt buộc — chỉ export `Tabs = { Base }`, không export component
 *     trần (thầy chốt 2026-07-25).
 *   • KHÔNG `children` — tab truyền qua `items` dữ liệu; `label` là prop
 *     `ReactNode` (nhãn), không phải children.
 *   • Bọc HeroUI TỐI ĐA (`Tabs`, `Badge`), alias `Hero*`.
 *   • STRICT §4: `selectedKey` + `onSelectionChange` TRẦN — the atom owns all
 *     tab chrome (indicator, icon scale `size-4`, badge float); the consumer
 *     never touches the compound structure.
 *   • `icon` = COMPONENT reference (`icon: House`), atom renders it at label
 *     scale — caller can't inject a wrong-size glyph (§5).
 *   • `isSkeleton` → tab-strip skeleton co-located (HeroSkeleton, hybrid C).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `House`), rendered by the atom at label scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** One tab in a {@link TabsBase} strip. */
export interface TabItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab label text. */
    label: ReactNode
    /** Leading icon as a COMPONENT reference (not JSX). Atom renders it at `size-4`. */
    icon?: IconComponent
    /** Count/notice floated over the label as a HeroUI `Badge` (e.g. `3`, `"9+"`). */
    badge?: ReactNode
    /** Render the tab but block selection. */
    isDisabled?: boolean
}

/** Props for {@link TabsBase}. */
export interface TabsBaseProps {
    /** Tabs in display order. */
    items: Array<TabItem>
    /** Currently selected tab id (controlled). */
    selectedKey: string
    /** Fired with the newly selected tab id. */
    onSelectionChange: (key: string) => void
    /** Accessible name for the tab list. */
    ariaLabel: string
    /**
     * `"primary"` (default) = HeroUI's segmented pill for a page-level panel
     * switch. `"secondary"` = the underline in-page content-tabs look.
     */
    variant?: "primary" | "secondary"
    /** Render the tab-strip skeleton (a row of pill shimmers) instead of the tabs. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The tab-strip atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link TabsBaseProps}
 */
const TabsBase = ({
    items,
    selectedKey,
    onSelectionChange,
    ariaLabel,
    variant = "primary",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: TabsBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — one pill per tab.
        return (
            <div className={cn("flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                {items.map((item) => (
                    <HeroSkeleton key={item.key} className="h-9 w-24 rounded-xl" />
                ))}
            </div>
        )
    }
    return (
        <HeroTabs
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn("whitespace-nowrap", className)}
        >
            <HeroTabs.ListContainer>
                <HeroTabs.List aria-label={ariaLabel}>
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <HeroTabs.Tab
                                key={item.key}
                                id={item.key}
                                isDisabled={item.isDisabled}
                                data-anat-part={showAnatomy ? "Tab" : undefined}
                            >
                                <span className="flex items-center gap-2">
                                    {Icon ? (
                                        // Atom owns the glyph scale (§4/§5) — tab label scale.
                                        <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
                                            <Icon className="size-4" />
                                        </span>
                                    ) : null}
                                    {item.badge !== undefined && item.badge !== null ? (
                                        <HeroBadge.Anchor data-anat-part={showAnatomy ? "Badge" : undefined}>
                                            <span>{item.label}</span>
                                            <HeroBadge size="sm" color="danger">
                                                {item.badge}
                                            </HeroBadge>
                                        </HeroBadge.Anchor>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </span>
                                <HeroTabs.Indicator data-anat-part={showAnatomy ? "Indicator" : undefined} />
                            </HeroTabs.Tab>
                        )
                    })}
                </HeroTabs.List>
            </HeroTabs.ListContainer>
            {/* react-aria's useTab always computes an `aria-controls` id pointing at a
                tabpanel; this atom carries no panel CONTENT (callers render their own
                below), so these stay empty/`sr-only` to satisfy the ARIA relationship. */}
            {items.map((item) => (
                <HeroTabs.Panel key={item.key} id={item.key} className="sr-only">
                    {null}
                </HeroTabs.Panel>
            ))}
        </HeroTabs>
    )
}

/**
 * `Tabs.*` — the tab-strip ATOM namespace. `Tabs.Base` is the single constrained
 * strip (icon / badge / disabled are LEAVES of it, per-item prop-driven).
 */
export const Tabs = {
    Base: TabsBase,
}
