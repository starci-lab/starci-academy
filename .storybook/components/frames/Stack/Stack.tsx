import React from "react"
import type { ReactNode } from "react"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { type LayoutAlign, type LayoutJustify, type SeamScale } from "@sb-components/frames/_spacing"
import { Flex } from "@sb-components/frames/Flex/Flex"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (frame) — `Stack.*`: the base one-axis track. Two members = two AXES,
 * the only real shapes a stack has:
 *   • `Stack.V` — stacks VERTICALLY (column).
 *   • `Stack.H` — stacks HORIZONTALLY (row); only this axis can `wrap`.
 *
 * FRAME API LAW (§13b): a stack WRAPS arbitrary content — it is not a repeating
 * list — so `children` is the road (there is no `header`/`body`/`footer` trio to
 * name: a track has exactly ONE slot, its content). `items` would be wrong here;
 * see `Cluster`/`Grid` for the repeat-list frames of this folder.
 *
 * ⭐ WHY THIS FRAME EXISTS (§10): `gap` is typed {@link SpaceScale} — a UNION
 * LITERAL of `0·1·2·3·6·8`. Off-scale (`gap-4`, `gap-5`, `gap-1.5`) cannot even
 * be typed, so the §10 scale is enforced by the COMPILER instead of by review.
 * `gap` is REQUIRED for the same reason: an implicit default would let the seam
 * be chosen by accident, and §10a says a seam has exactly one deliberate owner.
 *
 * §13 boundaries respected: no domain content, no feature behaviour — the track
 * only decides direction / gap / alignment / an optional rule between children.
 * `divider` COMPOSES the existing `Divider.Base` atom (§13c: a frame never
 * hand-rolls what an atom already owns).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props shared by both axes of {@link Stack}. */
export interface StackBaseProps {
    /**
     * Seam between children on the §10 scale — REQUIRED, union literal only
     * (`0` flush · `1` tight · `2` related · `3` grouped · `6` section · `8` page).
     * The PARENT owns this seam (§10a), so children must not carry margin.
     */
    gap: SeamScale
    /** Cross-axis alignment (`V` → horizontal, `H` → vertical). */
    align?: LayoutAlign
    /** Main-axis distribution (`V` → vertical, `H` → horizontal). */
    justify?: LayoutJustify
    /** `true` → inserts `Divider.Base` BETWEEN children (never before the first / after the last). */
    divider?: boolean
    /**
     * Anatomy tag for THIS frame itself — so the PARENT can badge it as ONE node (§11a.1).
     * Missing this prop means the `layouts`-tier frame is used but the panel cannot see it.
     */
    anatPart?: string
    /** The stacked content. A wrapper frame takes children (§13b). */
    children: ReactNode
    className?: string
    /** `true` → tag this frame's parts with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** Props for {@link Stack.V} — a vertical track (no row-only prop to add). */
export type StackVProps = StackBaseProps

/** Props for {@link Stack.H} — a horizontal track. */
export interface StackHProps extends StackBaseProps {
    /**
     * `true` → children flow onto a new line when the row runs out of width.
     * ROW-ONLY: a column already grows without bound, so wrapping is meaningless
     * on `Stack.V` and is not offered there.
     */
    wrap?: boolean
}

/**
 * Interleaves `Divider.Base` between children — NOT around them: N children get
 * N−1 rules. The atom carries its own `showAnatomy` (part name `Line`), so the
 * frame adds no wrapper element and the DOM is identical with badges on or off.
 *
 * On a ROW the rule is vertical and gets `self-stretch`: `align-self` overrides
 * the track's `items-*`, so the line spans the row's full height even when the
 * row is `items-center`.
 */
const interleaveDividers = (children: ReactNode, axis: "vertical" | "horizontal", showAnatomy: boolean) => {
    const nodes = React.Children.toArray(children)
    // `axis` = the TRACK's direction; a rule always runs ACROSS it.
    const ruleOrientation = axis === "vertical" ? "horizontal" : "vertical"
    return nodes.flatMap((child, index) =>
        index === 0
            ? [child]
            : [
                <Divider.Base
                    key={`stack-divider-${index}`}
                    orientation={ruleOrientation}
                    className={ruleOrientation === "vertical" ? "self-stretch" : undefined}
                    anatPart={showAnatomy ? "Divider.Base" : undefined}
                />,
                child,
            ],
    )
}

/**
 * Vertical track — the default way to stack anything down a column.
 *
 * @param props - {@link StackVProps}
 */
const StackV = ({
    gap,
    align = "stretch",
    justify,
    divider = false,
    children,
    className,
    showAnatomy = false,
    anatPart,
}: StackVProps) => (
    <Flex.Base
        direction="col"
        gap={gap}
        align={align}
        justify={justify}
        className={className}
        anatPart={anatPart ?? (showAnatomy ? "Track" : undefined)}
    >
        {divider ? interleaveDividers(children, "vertical", showAnatomy) : children}
    </Flex.Base>
)

const StackH = ({
    gap,
    align = "center",
    justify,
    wrap = false,
    divider = false,
    children,
    className,
    showAnatomy = false,
    anatPart,
}: StackHProps) => (
    <Flex.Base
        direction="row"
        gap={gap}
        align={align}
        justify={justify}
        wrap={wrap}
        className={className}
        anatPart={anatPart ?? (showAnatomy ? "Track" : undefined)}
    >
        {divider ? interleaveDividers(children, "horizontal", showAnatomy) : children}
    </Flex.Base>
)

export const Stack = {
    V: StackV,
    H: StackH,
}
