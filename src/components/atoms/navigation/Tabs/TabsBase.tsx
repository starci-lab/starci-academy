import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { Tabs as HeroTabs, Badge as HeroBadge, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `Tabs` — the single tab-strip atom wrapping HeroUI `Tabs`.
 *
 * Data-driven: pass `items` (id + label + optional `icon`/`badge`/`isDisabled`);
 * the atom renders the full HeroUI compound internally —
 * `Tabs.ListContainer > Tabs.List > Tabs.Tab` (+ `Tabs.Indicator`) plus the
 * `sr-only` `Tabs.Panel`s react-aria needs to keep the tab↔tabpanel ARIA
 * relationship valid. Variants (icon / badge / disabled) are driven by
 * per-item props, not separate components.
 *
 * Only `Tabs`/`TabsExtended` (from `./Tabs`) are exported — no bare component
 * from this file. No `children` — tabs pass through `items`; `label` is a
 * `ReactNode` prop, not children. The atom owns all tab chrome (indicator,
 * icon scale, badge float). `icon` is a component reference (`icon: House`);
 * the atom renders it at label scale so a caller cannot inject a wrong-size
 * glyph. `isSkeleton` renders a co-located tab-strip skeleton whose shape
 * follows `variant` (pill vs underline bar).
 */

/** An icon passed as a COMPONENT (e.g. `House`), rendered by the atom at label scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Tab glyph size + weight, in one place — the atom owns the scale, callers
 * pass a bare icon. The tab label is `text-sm` (14px), so the glyph is
 * `size-3.5` (14px), scaled against font-size (not line-height); smaller
 * than `size-5`, so it needs `weight="bold"` to compensate the stroke.
 */
const TAB_ICON_CLASS = "size-3.5"
const TAB_ICON_WEIGHT = "bold" as const

/** One tab in a {@link TabsBase} strip. */
export interface TabItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab label text. */
    label: ReactNode
    /** Leading icon as a COMPONENT reference (not JSX). Atom renders it at `size-3.5` + `bold`. */
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
    /**
     * Render the tab-strip shimmer instead of the tabs. Shape follows `variant`
     * — filled pill for `primary`, label+underline bar for `secondary` — so the
     * loading shape matches what the real strip is about to become.
     */
    isSkeleton?: boolean
    /** Position within the parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
}

/**
 * The tab-strip atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link TabsBaseProps}
 */
export const TabsBase = ({
    items,
    selectedKey,
    onSelectionChange,
    ariaLabel,
    variant = "primary",
    isSkeleton = false,
    classNames,
}: TabsBaseProps) => {
    if (isSkeleton) {
        // Shape follows `variant`, known ahead of load: `primary` is a filled
        // segmented pill, `secondary` an underline in-page tab, so the shimmer
        // is a label bar + underline bar for `secondary`, not a pill —
        // matching shapes avoids a layout jump once the real tabs mount.
        if (variant === "secondary") {
            return (
                <div data-tier="atom" data-component="Tabs" className={cn("flex items-center gap-2", classNames)}>
                    {items.map((item) => (
                        <div key={item.key} className="flex flex-col items-center gap-2 px-1 py-2">
                            <HeroSkeleton className="h-4 w-1/3 rounded-md" />
                            <HeroSkeleton className="h-0.5 w-1/3 rounded-full" />
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <div data-tier="atom" data-component="Tabs" className={cn("flex items-center gap-2", classNames)}>
                {items.map((item) => (
                    <HeroSkeleton key={item.key} className="h-9 w-1/3 rounded-xl" />
                ))}
            </div>
        )
    }
    return (
        <HeroTabs
            data-tier="atom"
            data-component="Tabs"
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn("whitespace-nowrap", classNames)}
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
                            >
                                <span className="flex items-center gap-2">
                                    {Icon ? (
                                        // Untagged: a plain span wrapping a caller-supplied Phosphor
                                        // icon, not a real named component of ours or of HeroUI's.
                                        <span aria-hidden className="inline-flex shrink-0">
                                            <Icon className={TAB_ICON_CLASS} weight={TAB_ICON_WEIGHT} />
                                        </span>
                                    ) : null}
                                    {item.badge !== undefined && item.badge !== null ? (
                                        // `Badge.Anchor` anchors the badge to the anchor's top-right
                                        // corner; the anchor here hugs a line of text with no empty
                                        // corner, so the badge overlaps the glyph without padding
                                        // (measured: covers 12px for a 1-char badge, 14px for "9+";
                                        // overhangs 4-5px). `pr-4` reserves 16px for the badge to sit
                                        // on. This pads the label asymmetrically, so a tab with a
                                        // badge is wider than one without and tab spacing isn't
                                        // perfectly even.
                                        <HeroBadge.Anchor className="pr-4">
                                            <span>{item.label}</span>
                                            <HeroBadge size="sm" color="danger">
                                                {item.badge}
                                            </HeroBadge>
                                        </HeroBadge.Anchor>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </span>
                                <HeroTabs.Indicator />
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

export const meta = { tier: "atom", name: "Tabs" } as const
