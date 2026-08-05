import React from "react"
import type { ReactNode } from "react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { type AllowedGap, type LayoutAlign, type LayoutJustify, type PaddingValue, type Responsive } from "@sb-components/frames/_spacing"
import { Flex } from "@sb-components/frames/Flex/Flex"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import type { PrincipleToken } from "@sb-components/frames/_principles"

/**
 * `Stack` -- a LAYOUT frame: the base one-axis track. Two members = two axes:
 *   - `StackV` -- stacks vertically (column).
 *   - `StackH` -- stacks horizontally (row); only this axis takes `at` (the
 *     container step it wraps below, never a bare boolean).
 *
 * A stack wraps arbitrary content (not a repeating list), so `children` is the
 * road -- a track has exactly one slot. Use `Cluster`/`Grid` for repeat-list
 * frames.
 *
 * `gap` is typed {@link Responsive}<{@link AllowedGap}> -- a closed index into the
 * house gap table, so off-scale cannot be typed. It is REQUIRED so the seam is
 * never chosen by accident.
 *
 * No domain content, no feature behaviour -- the track only decides direction /
 * gap / alignment / an optional rule between children. `divider` composes the
 * existing `Divider` atom.
 */

/** Props shared by both axes of {@link Stack}. */
export interface StackBaseProps {
    /**
     * Seam between children on the house gap scale -- REQUIRED.
     * The PARENT owns this seam (§10a), so children must not carry margin.
     */
    gap: Responsive<AllowedGap>
    /** Cross-axis alignment (`V` -> horizontal, `H` -> vertical). */
    align?: LayoutAlign
    /** Main-axis distribution (`V` -> vertical, `H` -> horizontal). */
    justify?: LayoutJustify
    /** `true` -> inserts `Divider` BETWEEN children (never before the first / after the last). */
    divider?: boolean
    /**
     * Space INSIDE the track, same scale as `gap`.
     *
     * Forwarded down to `Flex` so a stack that also needs padding no longer
     * has to DROP to `Flex` and lose `divider` plus the axis semantics.
     */
    padding?: Responsive<PaddingValue>
    /**
     * `true` -> a left guide border + matching indent (`pl-3`, `@app-sm:pl-6`),
     * for a track that is ONE LEVEL DEEPER than its caller (a threaded reply,
     * a nested tree row) -- the frame owns the exact classes so no block ever
     * hand-writes `border-l`/`pl-*` itself. Same vocabulary
     * as `SurfaceCard`'s own `variant="nested"` (border marks "inside a
     * parent", not a fresh outer face) -- this is that same idea for a track.
     */
    nested?: boolean
    /**
     * The HTML element to render, forwarded to `Flex`. Defaults to `div`.
     *
     * A stack that also needs a real tag (`section`, `figure`, `span`) would otherwise have to
     * DROP to hand-written classes and lose the axis semantics along the way.
     */
    as?: "div" | "section" | "figure" | "span" | "li"
    /**
     * `true` -> the track hugs its content (`inline-flex`) instead of taking the whole line.
     * Measured on the same content: the block box came out 503px, the inline box 136px.
     */
    inline?: boolean
    /**
     * Anatomy tag for THIS frame itself -- so the PARENT can badge it as ONE node (§11a.1).
     * Missing this prop means the `layouts`-tier frame is used but the panel cannot see it.
     */
    /** A SINGLE buildable child -- an uncalled `ComponentType<{isSkeleton?}>` the track renders itself. Use `items` for several. */
    body?: ComponentTypeWithSkeleton
    /**
     * The stacked content as BUILDABLE items -- each an uncalled `ComponentType<{isSkeleton?}>`
     * the track renders itself, so it can thread `isSkeleton` down and interleave dividers on the
     * real children. A frame that can BUILD its children can shimmer them (one tree, no hand-mirror).
     * Wins over `body` when both are passed.
     */
    items?: Array<ComponentTypeWithSkeleton>
    /** `true` -> the track passes `isSkeleton` to every `items` component so the whole column shimmers. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable -- it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this track's seam realises -- forwarded straight to the `Flex` this
     * track renders through, the same way `gap`/`align`/`justify` are. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    principles?: Array<PrincipleToken>
}

/** Props for {@link StackV} -- a vertical track (no row-only prop to add). */
export type StackVProps = StackBaseProps

/** Props for {@link StackH} -- a horizontal track. */
export interface StackHProps extends StackBaseProps {
    /**
     * Container step the row switches from wrapped to single-line at (FRAME-10). Below `at`
     * children flow onto a new line when the row runs out of width; at `at` and above the row
     * stays single-line. ROW-ONLY: a column already grows without bound, so this is meaningless
     * on `StackV` and is not offered there. Left out, the row never wraps -- same behaviour the
     * old `wrap={false}` default had.
     */
    at?: ResponsiveRowSwitch
}

/**
 * Interleaves `Divider` between children -- NOT around them: N children get
 * N-1 rules. Horizontal rules sit on the track as the atom. Vertical rules wrap
 * in a `self-stretch` Flex so the line spans the row's full height even when the
 * row is `items-center`, without passing placement classes into the atom.
 */
const interleaveDividers = (children: ReactNode, axis: "vertical" | "horizontal") => {
    const nodes = React.Children.toArray(children)
    // `axis` = the TRACK's direction; a rule always runs ACROSS it.
    const ruleOrientation = axis === "vertical" ? "horizontal" : "vertical"
    return nodes.flatMap((child, index) =>
        index === 0
            ? [child]
            : [
                ruleOrientation === "vertical" ? (
                    <Flex
                        key={`stack-divider-${index}`}
                        direction="row"
                        gap={1}
                        align="stretch"
                        classNames={["self-stretch"]}
                        body={<Divider orientation="vertical" />}
                    />
                ) : (
                    <Divider key={`stack-divider-${index}`} orientation="horizontal" />
                ),
                child,
            ],
    )
}

/**
 * Vertical track -- the default way to stack anything down a column.
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
    items,
    isSkeleton,
    padding,
    classNames,
    principles,
}: StackVProps) => {
    // `items` (buildable) is the preferred path -- the track renders each item itself, threading
    // `isSkeleton`; `body` (a plain node) is the simple fallback when no build/shimmer is needed.
    const content = (items ?? (body ? [body] : [])).map((Item, index) => <Item key={index} isSkeleton={isSkeleton} />)
    return (
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
            principles={principles}
            body={divider ? interleaveDividers(content, "vertical") : content}
        />
    )
}

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
    items,
    isSkeleton,
    padding,
    classNames,
    principles,
}: StackHProps) => {
    const content = (items ?? (body ? [body] : [])).map((Item, index) => <Item key={index} isSkeleton={isSkeleton} />)
    return (
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
            principles={principles}
            body={divider ? interleaveDividers(content, "horizontal") : content}
        />
    )
}

export { StackV, StackH }

/**
 * Source-level tier marker -- lets a gate read the tier without guessing from the folder path.
 *
 * Shaped as a record, not the single `{ tier, name }` most frame files export: this file has
 * TWO public components, not one, and neither is more "the" component this file names. See
 * `Flex.tsx`'s own `meta` note for the DOM side of this -- `StackV`/`StackH` render no element
 * of their own (100% delegated to `Flex`), so `data-component` on a rendered Stack instance
 * reads `"Flex"`, not `"StackV"`/`"StackH"`; this export is the source-level identity, which a
 * gate can still read even though the DOM cannot show it.
 */
export const meta = {
    StackV: { tier: "frame", name: "StackV" },
    StackH: { tier: "frame", name: "StackH" },
} as const
