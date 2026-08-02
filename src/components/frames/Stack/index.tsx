import React from "react"
import type { ReactNode } from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Divider } from "@/components/atoms/display/Divider"
import { type AllowedGap, type LayoutAlign, type LayoutJustify, type PaddingValue, type Responsive } from "@/components/frames/_spacing"
import { Flex } from "@/components/frames/Flex"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (frame) — `Stack.*`: the base one-axis track. Two members = two AXES,
 * the only real shapes a stack has:
 *   • `StackV` — stacks VERTICALLY (column).
 *   • `StackH` — stacks HORIZONTALLY (row); only this axis takes `at` (FRAME-10:
 *     the container step it wraps below, never a bare boolean).
 *
 * FRAME API LAW (§13b): a stack WRAPS arbitrary content — it is not a repeating
 * list — so `children` is the road (there is no `header`/`body`/`footer` trio to
 * name: a track has exactly ONE slot, its content). `items` would be wrong here;
 * see `Cluster`/`Grid` for the repeat-list frames of this folder.
 *
 * ⭐ WHY THIS FRAME EXISTS: `gap` is typed {@link Responsive}<{@link AllowedGap}> — a
 * CLOSED index into the house gap table. Off-scale (`gap-4.5`, `gap-[13px]`) cannot even
 * be typed, so the scale is enforced by the COMPILER instead of by review.
 * `gap` is REQUIRED for the same reason: an implicit default would let the seam
 * be chosen by accident, and §10a says a seam has exactly one deliberate owner.
 *
 * §13 boundaries respected: no domain content, no feature behaviour — the track
 * only decides direction / gap / alignment / an optional rule between children.
 * `divider` COMPOSES the existing `Divider` atom (§13c: a frame never
 * hand-rolls what an atom already owns).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props shared by both axes of {@link Stack}. */
export interface StackBaseProps {
    /**
     * Seam between children on the house gap scale — REQUIRED.
     * The PARENT owns this seam (§10a), so children must not carry margin.
     */
    gap: Responsive<AllowedGap>
    /** Cross-axis alignment (`V` → horizontal, `H` → vertical). */
    align?: LayoutAlign
    /** Main-axis distribution (`V` → vertical, `H` → horizontal). */
    justify?: LayoutJustify
    /** `true` → inserts `Divider` BETWEEN children (never before the first / after the last). */
    divider?: boolean
    /**
     * Space INSIDE the track, same scale as `gap`.
     *
     * ⭐ 2026-07-27: forwarded down to `Flex` so a stack that also needs padding no longer
     * has to DROP to `Flex` and lose `divider` plus the axis semantics. That drop was the
     * one remaining reason to reach past this frame, and a way out that costs less than the
     * proper road always wins — the same force that produced 227 hand-written
     * `flex flex-col gap-4` in the first place.
     */
    padding?: Responsive<PaddingValue>
    /**
     * `true` → a left guide border + matching indent (`pl-3`, `@app-sm:pl-6`),
     * for a track that is ONE LEVEL DEEPER than its caller (a threaded reply,
     * a nested tree row) — the frame owns the exact classes so no block ever
     * hand-writes `border-l`/`pl-*` itself (teacher 2026-07-28). Same vocabulary
     * as `SurfaceCard`'s own `variant="nested"` (border marks "inside a
     * parent", not a fresh outer face) — this is that same idea for a track.
     */
    nested?: boolean
    /**
     * The HTML element to render, forwarded to `Flex`. Defaults to `div`.
     *
     * Added 2026-07-29 for the same reason `padding` was: a stack that also needed a real tag
     * (`section`, `figure`, `span`) had to DROP to hand-written classes and lose the axis
     * semantics along the way. Three call-sites sat outside the frame tier for exactly that.
     */
    as?: "div" | "section" | "figure" | "span" | "li"
    /**
     * `true` → the track hugs its content (`inline-flex`) instead of taking the whole line.
     * Measured on the same content: the block box came out 503px, the inline box 136px.
     */
    inline?: boolean
    /**
     * Anatomy tag for THIS frame itself — so the PARENT can badge it as ONE node (§11a.1).
     * Missing this prop means the `layouts`-tier frame is used but the panel cannot see it.
     */
    /** The stacked content. A wrapper frame takes a named slot (§13b). */
    body?: ReactNode
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this track's seam realises — forwarded straight to the `Flex` this
     * track renders through, the same way `gap`/`align`/`justify` are. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    pattern?: string
}

/** Props for {@link StackV} — a vertical track (no row-only prop to add). */
export type StackVProps = StackBaseProps

/** Props for {@link StackH} — a horizontal track. */
export interface StackHProps extends StackBaseProps {
    /**
     * Container step the row switches from wrapped to single-line at (FRAME-10). Below `at`
     * children flow onto a new line when the row runs out of width; at `at` and above the row
     * stays single-line. ROW-ONLY: a column already grows without bound, so this is meaningless
     * on `StackV` and is not offered there. Left out, the row never wraps — same behaviour the
     * old `wrap={false}` default had.
     */
    at?: ResponsiveRowSwitch
}

/**
 * Interleaves `Divider` between children — NOT around them: N children get
 * N−1 rules. The atom carries its own `` (part name `Line`), so the
 * frame adds no wrapper element and the DOM is identical with badges on or off.
 *
 * On a ROW the rule is vertical and gets `self-stretch`: `align-self` overrides
 * the track's `items-*`, so the line spans the row's full height even when the
 * row is `items-center`.
 */
const interleaveDividers = (children: ReactNode, axis: "vertical" | "horizontal") => {
    const nodes = React.Children.toArray(children)
    // `axis` = the TRACK's direction; a rule always runs ACROSS it.
    const ruleOrientation = axis === "vertical" ? "horizontal" : "vertical"
    return nodes.flatMap((child, index) =>
        index === 0
            ? [child]
            : [
                <Divider
                    key={`stack-divider-${index}`}
                    orientation={ruleOrientation}
                    classNames={ruleOrientation === "vertical" ? ["self-stretch"] : undefined}
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
    as: Tag,
    inline,
    gap,
    align = "stretch",
    justify,
    divider = false,
    nested = false,
    body,
    padding,
    classNames,
    pattern}: StackVProps) => (
    <Flex
        as={Tag}
        inline={inline}
        direction="col"
        gap={gap}
        padding={padding}
        align={align}
        justify={justify}
        nested={nested}
        classNames={classNames}
        pattern={pattern}
        body={divider ? interleaveDividers(body, "vertical") : body}
    />
)

const StackH = ({
    as: Tag,
    inline,
    gap,
    align = "center",
    justify,
    at,
    divider = false,
    nested = false,
    body,
    padding,
    classNames,
    pattern}: StackHProps) => (
    <Flex
        as={Tag}
        inline={inline}
        direction="row"
        gap={gap}
        padding={padding}
        align={align}
        justify={justify}
        at={at}
        nested={nested}
        classNames={classNames}
        pattern={pattern}
        body={divider ? interleaveDividers(body, "horizontal") : body}
    />
)

export { StackV, StackH }

/**
 * Source-level tier marker — lets a gate read the tier without guessing from the folder path.
 *
 * Shaped as a record, not the single `{ tier, name }` most frame files export: this file has
 * TWO public components, not one, and neither is more "the" component this file names. See
 * `Flex`'s own `meta` note for the DOM side of this — `StackV`/`StackH` render no element
 * of their own (100% delegated to `Flex`), so `data-component` on a rendered Stack instance
 * reads `"Flex"`, not `"StackV"`/`"StackH"`; this export is the source-level identity, which a
 * gate can still read even though the DOM cannot show it.
 */
export const meta = {
    StackV: { tier: "frame", name: "StackV" },
    StackH: { tier: "frame", name: "StackH" },
} as const
