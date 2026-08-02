import React from "react"
import type { ReactNode } from "react"
import { Tabs as HeroTabs, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `TabsExtended`: the StarCi tab strip, wrapping the HeroUI `Tabs` root. Lives in the
 * `Tabs.*` namespace (see the `TabsExtended.tsx` header for why `children` here is a valid
 * exception rather than debt).
 * 
 * 1 PROP THAT PRODUCES A SHAPE = 1 LEAF. Leaf set = `Default` (bare) + one leaf per
 * shape-producing prop: `variant` · `size`. `selectedKey`/`onSelectionChange` is the
 * controlled mechanism (no leaf), `className` is an escape hatch (no leaf).
 * 
 * `children` is a named exception (atom-wrapper): consumers like `Toolbar` attach an
 * `accent`/`muted` class to each tab and hide responsive labels — something a data-only
 * `TabItem` can't carry. A "builds N children" prop has a leaf, and that leaf is `Default`.
 * The `Size` leaf covers the two values of `size` (truncates w-full vs sizes-to-label w-fit);
 * `Variant` covers the variant union.
 * 
 * `annotate`: the atom wraps HeroUI `Tabs` directly (aliased `HeroTabs`), and the only DOM
 * node it owns is the root `<Tabs>` — the `Tabs.ListContainer > Tabs.List > Tabs.Tab` tree
 * below belongs to the story that builds `children`, so only the root `<Tabs>` is tagged
 * (`"Tabs"`, heroui tier).
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
    /**
     * `true` → tag the root `HeroTabs` with `` so a
     * BlockAnatomy panel can badge it. The `children` tree is the caller's
     * own — it stays untagged here, since it isn't this atom's own render.
     */
    /** Position within the parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
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
    classNames,
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
                classNames,
            )}

        >
            {children}
        </HeroTabs>
    )
}

export const meta = { tier: "atom", name: "TabsExtended" } as const
