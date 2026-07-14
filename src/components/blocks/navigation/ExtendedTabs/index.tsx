import React from "react"
import type { ReactNode } from "react"
import { Tabs, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link ExtendedTabs} block. */
export interface ExtendedTabsProps extends WithClassNames<undefined> {
    /** Currently selected tab id (controlled). */
    selectedKey: string
    /** Fired with the newly selected tab id. */
    onSelectionChange: (key: string) => void
    /**
     * Tab anatomy — keep using the HeroUI compound parts inside:
     * `Tabs.ListContainer` > `Tabs.List` > `Tabs.Tab` (+ `Tabs.Indicator`).
     */
    children: ReactNode
    /**
     * HeroUI `Tabs` variant. `"secondary"` (default) = in-page CONTENT tabs —
     * hugs its own label width (packs left, `.extended-tabs` override), no
     * outer baseline (the feature wrapper owns any full-width chrome; see
     * `TabsCard` §1). `"primary"` = page-FEATURE tabs that switch the ENTIRE
     * panel content — HeroUI's own default rendering (segmented pill,
     * full-width, evenly-stretched tabs), untouched by the `.extended-tabs`
     * hug-content override. Use `"primary"` for top-level section switches
     * (e.g. Bắt đầu/Lịch sử/Thống kê), `"secondary"` for a content filter/
     * language-switcher riding alongside a reading column.
     */
    variant?: "primary" | "secondary"
    /**
     * `"md"` (default) = full-width (`w-full`), evenly-stretched tabs — the
     * only size this block used to support. `"sm"` shrinks a `"primary"` tab
     * strip to `w-fit` (segments size to their label, don't stretch) — for a
     * compact secondary choice that shouldn't claim the full row (e.g. a
     * setting nested inside a modal panel). Has no effect on `"secondary"`
     * (already hug-content via `.extended-tabs`).
     */
    size?: "sm" | "md"
}

/**
 * The StarCi standard tab strip: a thin wrapper over the HeroUI `Tabs` root.
 * `variant="secondary"` (default) bakes in the underline look — foreground text
 * on the selected tab + an accent indicator — and drops the built-in
 * `.tabs__list` baseline (so it never doubles up with an outer separator; see
 * `.extended-tabs` in globals.css). `variant="primary"` renders HeroUI's plain
 * default Tabs (full-width segmented pill) for page-level feature switches.
 * Drop-in replacement for `<Tabs>`; the children still use the `Tabs.*`
 * compound parts. Use this instead of styling `Tabs` per-feature.
 *
 * @param props - {@link ExtendedTabsProps}
 */
export const ExtendedTabs = ({
    selectedKey,
    onSelectionChange,
    children,
    className,
    variant = "secondary",
    size = "md",
}: ExtendedTabsProps) => {
    return (
        <Tabs
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn(
                variant === "secondary" ? "extended-tabs" : size === "sm" ? "w-fit" : "w-full",
                className,
            )}
        >
            {children}
        </Tabs>
    )
}
