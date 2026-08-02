import type { ReactNode } from "react"
import { Toolbar, type ToolbarTabGroup } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { type SurfaceCardVariant } from "@sb-components/composites/cards/SurfaceCard/surface-card-header"
import { type AllowedPadding } from "@sb-components/frames/_spacing"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `DoubleTabsCard` — a `Toolbar` (two tab groups) living inside a `SurfaceCard`
 * face, rather than sitting bare on the page canvas the way `ContentModeNav` does.
 * It is the named combination of `SurfaceCard`+`Toolbar` so every caller that needs
 * "tabs inside a card" reaches for the same shape.
 *
 * Owns the seam between the tab row and the body (`Toolbar`'s row sits inside the
 * card's `header`; `padding` on the card governs the body). Does not own what the
 * tabs ARE — that vocabulary stays with whichever block calls it.
 */

/** Props for {@link DoubleTabsCard}. */
export interface DoubleTabsCardProps {
    /** Primary tab group, pinned left — same shape `Toolbar` itself takes. */
    leftTabs: ToolbarTabGroup
    /** Inline cluster right after the left group (e.g. a manage/add action). */
    leftEnd?: ReactNode
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
    /** Card body BELOW the tab row. */
    body?: ReactNode
    /** Card face: `"surface"` (default, shadow) or `"nested"` (border only). */
    cardVariant?: SurfaceCardVariant
    /** Padding around the body, §10c scale. Default `{4}` (`SurfaceCard`'s own default). */
    padding?: AllowedPadding
    /** Layout utilities on the card's outer section wrapper, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
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
    leftEnd,
    rightTabs,
    collapseRightOnMobile,
    rightTabsNeutral,
    variant = "secondary",
    tabSize = "md",
    body,
    cardVariant,
    padding,
    classNames,
}: DoubleTabsCardProps) => (
    <SurfaceCard
        variant={cardVariant}
        padding={padding}
        classNames={classNames}


        header={() => (
            <Toolbar
                leftTabs={leftTabs}
                leftEnd={leftEnd}
                rightTabs={rightTabs}
                collapseRightOnMobile={collapseRightOnMobile}
                rightTabsNeutral={rightTabsNeutral}
                variant={variant}
                size={tabSize}


            />
        )}
        body={() => body}
    />
)

export { DoubleTabsCard }
