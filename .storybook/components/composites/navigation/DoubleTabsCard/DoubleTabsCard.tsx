import type { ReactNode } from "react"
import { Toolbar, type ToolbarTabGroup } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { type SurfaceCardVariant } from "@sb-components/composites/cards/SurfaceCard/surface-card-header"
import { type InsetScale } from "@sb-components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `DoubleTabsCard`: a `Toolbar` (two tab groups)
 * living inside a `SurfaceCard` face, instead of sitting bare on the page
 * canvas the way `ContentModeNav` does today.
 *
 * ⭐ COMPOSES, DOES NOT REINVENT (thầy 2026-07-29, "tạo thêm doubleTabsCard từ
 * Toolbar + Card"). `SurfaceCard.Base`'s own `header` slot is already
 * documented for exactly this shape ("a title row, A TOOLBAR") — this
 * composite is that ONE combination, named, so every caller that needs "tabs
 * inside a card" reaches for the same shape instead of re-composing
 * `SurfaceCard`+`Toolbar` by hand at each call-site (the drift `Alert.Base`
 * itself was created to avoid, §5.0/`Alert.tsx`).
 *
 * OWNS: the seam between the tab row and the body (`Toolbar`'s own `p-3`-ish
 * row sits INSIDE the card's `header`, `padding` on the card governs the body).
 * DOES NOT own: what the tabs ARE (mode/language/anything) — that vocabulary
 * stays with whichever block calls this (§6a.1: this composite stays generic).
 * ─────────────────────────────────────────────────────────────────────────────
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
    children?: ReactNode
    /** Card face: `"surface"` (default, shadow) or `"nested"` (border only). */
    cardVariant?: SurfaceCardVariant
    /** Padding around the body, §10c scale. Default `3` (`SurfaceCard`'s own default). */
    padding?: InsetScale
    /** Extra classes on the card's outer section wrapper. */
    className?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this composite so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * A `Toolbar` living inside a `SurfaceCard` face. See the file header for the
 * full contract.
 *
 * @param props - {@link DoubleTabsCardProps}
 */
const DoubleTabsCard = ({
    leftTabs,
    leftEnd,
    rightTabs,
    collapseRightOnMobile,
    rightTabsNeutral,
    variant = "secondary",
    tabSize = "md",
    children,
    cardVariant,
    padding,
    className,
    showAnatomy = false,
    anatPart,
}: DoubleTabsCardProps) => (
    <SurfaceCard
        variant={cardVariant}
        padding={padding}
        className={className}
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        header={
            <Toolbar
                leftTabs={leftTabs}
                leftEnd={leftEnd}
                rightTabs={rightTabs}
                collapseRightOnMobile={collapseRightOnMobile}
                rightTabsNeutral={rightTabsNeutral}
                variant={variant}
                size={tabSize}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "Toolbar" : undefined}
            />
        }
    >
        {children}
    </SurfaceCard>
)

export { DoubleTabsCard }
