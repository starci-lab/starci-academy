import { Toolbar, type ToolbarTabGroup } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { type SurfaceCardVariant } from "@sb-components/composites/cards/SurfaceCard/surface-card-header"
import { type AllowedPadding } from "@sb-components/frames/_spacing"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `DoubleTabsCard` — a `Toolbar` (two tab groups) living inside a `SurfaceCard` face instead of
 * sitting bare on the page canvas. Composes `SurfaceCard`'s `header` slot rather than reinventing
 * it. Leaves by structure: a second tab group appearing, or the card face switching to `nested`;
 * which tab is selected is data.
 */

/** Props for {@link DoubleTabsCard}. */
export interface DoubleTabsCardProps {
    /** Primary tab group, pinned left — same shape `Toolbar` itself takes. */
    leftTabs: ToolbarTabGroup
    /**
     * Inline cluster right after the left group (e.g. a manage/add action) — a
     * component reference (COMPOSITE-8) the shell mounts itself, never an
     * already-built node, so `isSkeleton` can reach inside it.
     */
    leftEnd?: ComponentTypeWithSkeleton
    /** Optional secondary tab group, pinned right (e.g. a filter/sort switch). */
    rightTabs?: ToolbarTabGroup
    /**
     * Collapse `rightTabs` into a compact dropdown below `@app-sm`. See
     * `Toolbar`'s own prop doc — same trade-off, same default (off).
     */
    collapseRightOnMobile?: boolean
    /** Render `rightTabs` with NEUTRAL (not accent) selected chrome. */
    rightTabsNeutral?: boolean
    /** `"secondary"` (default, underline) or `"primary"` (page-feature tabs). */
    variant?: "primary" | "secondary"
    /** `"md"` (default, full-width) or `"sm"` (compact, hugs content). */
    tabSize?: "sm" | "md"
    /**
     * Card body BELOW the tab row — a component reference (COMPOSITE-8) the
     * shell mounts itself, never an already-built node, so `isSkeleton` can
     * reach inside it.
     */
    body?: ComponentTypeWithSkeleton
    /** Card face: `"surface"` (default, shadow) or `"nested"` (border only). */
    cardVariant?: SurfaceCardVariant
    /** Padding around the body, §10c scale. Default `{4}` (`SurfaceCard`'s own default). */
    padding?: AllowedPadding
    /** Layout utilities on the card's outer section wrapper, from the closed positioning union. */
    /**
     * `true` → every content-region slot this shell mounts (`leftEnd` / `body`)
     * is CALLED with `isSkeleton` too (COMPOSITE-8 — each is a component
     * reference this shell calls itself, so the flag reaches inside it), and
     * forwarded to the underlying `SurfaceCard` so its own loading chrome matches.
     */
    isSkeleton?: boolean
}

/**
 * A `Toolbar` living inside a `SurfaceCard` face. See the file header for the
 * full contract.
 *
 * @param props - {@link DoubleTabsCardProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DoubleTabsCard" } as const

const DoubleTabsCard = ({
    leftTabs,
    leftEnd: LeftEnd,
    rightTabs,
    collapseRightOnMobile,
    rightTabsNeutral,
    variant = "secondary",
    tabSize = "md",
    body: Body,
    cardVariant,
    padding,
    
    isSkeleton = false,
}: DoubleTabsCardProps) => (
    <SurfaceCard
        variant={cardVariant}
        padding={padding}
        isSkeleton={isSkeleton}
        header={() => (
            <Toolbar
                leftTabs={leftTabs}
                leftEnd={LeftEnd ? <LeftEnd isSkeleton={isSkeleton} /> : undefined}
                rightTabs={rightTabs}
                collapseRightOnMobile={collapseRightOnMobile}
                rightTabsNeutral={rightTabsNeutral}
                variant={variant}
                size={tabSize}
            />
        )}
        body={() => (Body ? <Body isSkeleton={isSkeleton} /> : null)}
    />
)

export { DoubleTabsCard }
