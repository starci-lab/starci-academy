import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { ALIGN_CLASS, GAP_CLASS, JUSTIFY_CLASS, PADDING_CLASS, type LayoutAlign, type LayoutJustify, type SeamScale, type InsetScale } from "@sb-components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME. `Flex.Base` is THE flex box of the system, and the ONLY place in the drawing
 * allowed to write `flex`, `flex-col`, `flex-wrap`, `items-*`, `justify-*` or `gap-*`.
 *
 * WHY IT EXISTS (teacher, 2026-07-27). The spacing scale was already typed, yet 227 places in
 * the stories still hand wrote `flex flex-col gap-4` because reaching for a frame cost more
 * keystrokes than writing the classes. Measured, those 227 places break down as 126 columns,
 * 48 wrapping rows, 46 rows and 6 split rows, so a single box with a direction and a wrap flag
 * covers 226 of them. With the classes living here, changing how a gap step renders is one edit
 * instead of a sweep across the tree.
 *
 * Every axis is a UNION, so an off scale value is a type error where it is written rather than
 * something a reviewer has to notice. That is the whole point of the frame tier: the 10 scale
 * stops being a convention people remember and becomes something the compiler holds.
 *
 * Named frames stay, they simply stop owning classes. `Stack.V` still means vertical rhythm and
 * `Split` still means two named sides; they now delegate here, so the vocabulary survives while
 * the implementation lives in one file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Main axis. `col` grows without bound, which is why only `row` can wrap. */
export type FlexDirection = "row" | "col"

/** Props for {@link Flex.Base}. */
export interface FlexBaseProps {
    /** Main axis. Defaults to `row`, the browser default, so the prop reads as an override. */
    direction?: FlexDirection
    /** Space between children, pinned to the 10 scale. Required so nobody leaves it to chance. */
    gap: SeamScale
    /**
     * Space INSIDE the box, pinned to the same scale as the gap.
     *
     * Added 2026-07-27 for the same reason the gap is typed. Padding was a rule that lived only
     * in prose: no frame offered it, so anyone who needed inner space wrote `p-5` by hand and
     * nothing objected. Measured at the time: 816 padding classes across the drawing, 48 of them
     * off the scale, against zero off scale gaps. A rule with no typed path is a rule people
     * route around, so the path exists here now.
     *
     * Leaving it out renders no padding class at all, which keeps a plain layout box free of
     * inner space and matches how the frame behaved before.
     */
    padding?: InsetScale
    /** Cross axis alignment. `stretch` on a column, `center` on a row, matching the old Stack defaults. */
    align?: LayoutAlign
    /** Main axis distribution. Left out means the browser default, which is `start`. */
    justify?: LayoutJustify
    /**
     * Let the row run onto a second line. Meaningless on a column, and the render below ignores
     * it there rather than emitting a class that does nothing.
     */
    wrap?: boolean
    /** The content being laid out. */
    children: ReactNode
    /** Placement only, never a way to restyle the box. */
    className?: string
    /** Name this box in a BlockAnatomy panel. */
    anatPart?: string
    /** Story only: emit `data-anat-part` so a panel can badge the box. */
    showAnatomy?: boolean
}

/** Direction to its literal class. Tailwind never emits an interpolated `flex-${x}`. */
const DIRECTION_CLASS: Record<FlexDirection, string> = {
    row: "flex-row",
    col: "flex-col",
}

/**
 * The one flex box. Renders a single `div` and nothing else, so wrapping something in `Flex`
 * never changes the tree beyond the box the layout needs.
 *
 * @param props - {@link FlexBaseProps}
 */
const FlexBase = ({
    direction = "row",
    gap,
    padding,
    align,
    justify,
    wrap = false,
    children,
    className,
    anatPart,
    showAnatomy = false,
}: FlexBaseProps) => (
    <div
        data-anat-part={anatPart ?? (showAnatomy ? "Flex" : undefined)}
        className={cn(
            "flex",
            DIRECTION_CLASS[direction],
            GAP_CLASS[gap],
            padding != null && PADDING_CLASS[padding],
            align != null && ALIGN_CLASS[align],
            justify != null && JUSTIFY_CLASS[justify],
            // A column already grows without bound, so wrapping it would emit a class that can
            // never fire. Ignoring it here keeps the rendered class list honest.
            wrap && direction === "row" && "flex-wrap",
            className,
        )}
    >
        {children}
    </div>
)

/** `Flex.*` namespace. One shape, so only `.Base`. */
/**
 * ⛔ INTERNAL to the frame tier (2026-07-27). `Stack.V`/`.H` are the public road; this box
 * is what they are built on. It stays exported ONLY because `Stack.tsx` imports it — no
 * story, and nothing outside `components/frames/` may call it.
 *
 * WHY it is not a public frame: it takes `direction` as a prop, so it can express any
 * one-axis track, which makes it a strictly weaker `Stack` — same shapes, minus `divider`,
 * minus the axis stated in the name. A public frame that can do everything the constrained
 * one can is not a second option, it is the way the constraint gets bypassed.
 */
export const Flex = Object.assign(FlexBase, {
    Base: FlexBase,
})
