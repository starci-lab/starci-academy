import React from "react"
import type { ReactNode } from "react"
import { Tabs as HeroTabs, cn } from "@heroui/react"

/**
 * `TabsExtended` — wrapper atom over HeroUI `Tabs`, for callers that build the
 * `Tabs.*` compound tree themselves (e.g. `Toolbar`, where each tab carries
 * chrome — accent/muted styling, responsive label hiding, size — that a
 * `TabItem` data shape cannot carry). Use `Tabs` (`items`) instead when tabs
 * are pure content. Same wrapper-atom shape as `Tooltip` (wraps an arbitrary
 * trigger) / `Badge`.
 *
 * The `variant="secondary"` look depends on the `.extended-tabs` class defined
 * in `src/app/globals.css`, not in this file — it renders correctly in
 * Storybook only when those globals are loaded.
 */

/** Props for {@link TabsExtended}. */
export interface TabsExtendedProps {
    /** Currently selected tab id (controlled). */
    selectedKey: string
    /** Fired with the newly selected tab id. */
    onSelectionChange: (key: string) => void
    /**
     * Build the HeroUI compound tree directly: `Tabs.ListContainer` >
     * `Tabs.List` > `Tabs.Tab` (+ `Tabs.Indicator`). See file header for why
     * this atom takes `children` instead of `items`.
     */
    children: ReactNode
    /**
     * HeroUI `Tabs` variant. `"secondary"` (default) = in-page content tabs —
     * hugs its own label width (packs left, `.extended-tabs` override), no
     * outer baseline (the feature wrapper owns any full-width chrome).
     * `"primary"` = page-feature tabs that switch the entire panel content —
     * HeroUI's own default rendering (segmented pill, full-width,
     * evenly-stretched tabs), untouched by the `.extended-tabs` hug-content
     * override. Use `"primary"` for top-level section switches (e.g.
     * Start/History/Statistics), `"secondary"` for a content filter/
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
 * `.tabs__list` baseline. `variant="primary"` renders HeroUI's plain default Tabs
 * (full-width segmented pill) for page-level feature switches. Drop-in replacement
 * for `<Tabs>`; the children still use the `Tabs.*` compound parts.
 *
 * @param props - {@link TabsExtendedProps}
 */
export const TabsExtended = ({
    selectedKey,
    onSelectionChange,
    children,
    variant = "secondary",
    size = "md",
}: TabsExtendedProps) => {
    return (
        <HeroTabs
            data-tier="atom"
            data-component="TabsExtended"
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn(
                // tab labels must never wrap to a 2nd line — white-space inherits down to
                // every Tabs.Tab, so a squeezed segment truncates (w-full) or sizes to the
                // one-line label (w-fit) instead of stacking words.
                "whitespace-nowrap",
                variant === "secondary" ? "extended-tabs" : size === "sm" ? "w-fit" : "w-full",
            )}
        >
            {children}
        </HeroTabs>
    )
}

/** Tier metadata for `TabsExtended`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "TabsExtended" } as const
