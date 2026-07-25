import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import {
    ALIGN_CLASS,
    GAP_CLASS,
    JUSTIFY_CLASS,
    type LayoutAlign,
    type LayoutJustify,
    type SpaceScale,
} from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Stack.*`: the base one-axis track. Two members = two AXES,
 * the only real shapes a stack has:
 *   • `Stack.V` — xếp DỌC (column).
 *   • `Stack.H` — xếp NGANG (row); only this axis can `wrap`.
 *
 * KHUNG API LAW (§13b): a stack WRAPS arbitrary content — it is not a repeating
 * list — so `children` is the road (there is no `header`/`body`/`footer` trio to
 * name: a track has exactly ONE slot, its content). `items` would be wrong here;
 * see `Cluster`/`Grid` for the repeat-list frames of this folder.
 *
 * ⭐ WHY THIS KHUNG EXISTS (§10): `gap` is typed {@link SpaceScale} — a UNION
 * LITERAL of `0·1·2·3·6·8`. Off-scale (`gap-4`, `gap-5`, `gap-1.5`) cannot even
 * be typed, so the §10 scale is enforced by the COMPILER instead of by review.
 * `gap` is REQUIRED for the same reason: an implicit default would let the seam
 * be chosen by accident, and §10a says a seam has exactly one deliberate owner.
 *
 * §13 boundaries respected: no domain content, no feature behaviour — the track
 * only decides direction / gap / alignment / an optional rule between children.
 * `divider` COMPOSES the existing `Divider.Base` atom (§13c: khung never
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
    gap: SpaceScale
    /** Cross-axis alignment (`V` → horizontal, `H` → vertical). */
    align?: LayoutAlign
    /** Main-axis distribution (`V` → vertical, `H` → horizontal). */
    justify?: LayoutJustify
    /** `true` → chèn `Divider.Base` GIỮA các con (never before the first / after the last). */
    divider?: boolean
    /** The stacked content. A wrapper khung takes children (§13b). */
    children: ReactNode
    className?: string
    /** `true` → tag this khung's parts with `data-anat-part` for a BlockAnatomy panel. */
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
 * khung adds no wrapper element and the DOM is identical with badges on or off.
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
                    showAnatomy={showAnatomy}
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
}: StackVProps) => (
    <div
        data-anat-part={showAnatomy ? "Track" : undefined}
        className={cn(
            "flex flex-col",
            GAP_CLASS[gap],
            ALIGN_CLASS[align],
            justify != null && JUSTIFY_CLASS[justify],
            className,
        )}
    >
        {divider ? interleaveDividers(children, "vertical", showAnatomy) : children}
    </div>
)

/**
 * Horizontal track — a row of siblings, optionally wrapping.
 *
 * @param props - {@link StackHProps}
 */
const StackH = ({
    gap,
    align = "center",
    justify,
    wrap = false,
    divider = false,
    children,
    className,
    showAnatomy = false,
}: StackHProps) => (
    <div
        data-anat-part={showAnatomy ? "Track" : undefined}
        className={cn(
            "flex flex-row",
            wrap && "flex-wrap",
            GAP_CLASS[gap],
            ALIGN_CLASS[align],
            justify != null && JUSTIFY_CLASS[justify],
            className,
        )}
    >
        {divider ? interleaveDividers(children, "horizontal", showAnatomy) : children}
    </div>
)

/**
 * `Stack.*` — the one-axis track khung namespace. `V` (dọc) · `H` (ngang).
 * Namespace only — no bare component export (§13a).
 */
export const Stack = {
    V: StackV,
    H: StackH,
}
