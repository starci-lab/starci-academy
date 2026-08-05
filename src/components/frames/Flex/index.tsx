import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { ALIGN_CLASS, gapClassNames, JUSTIFY_CLASS, paddingClassNames, type AllowedGap, type LayoutAlign, type LayoutJustify, type PaddingValue, type Responsive } from "@/components/frames/_spacing"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME. `Flex` is THE flex box of the system, and the ONLY place in the drawing
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
 * Named frames stay, they simply stop owning classes. `StackV` still means vertical rhythm and
 * `Split` still means two named sides; they now delegate here, so the vocabulary survives while
 * the implementation lives in one file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Main axis. `col` grows without bound, which is why only `row` can wrap. */
export type FlexDirection = "row" | "col"

/** Props for {@link Flex}. */
export interface FlexBaseProps {
    /**
     * The HTML element to render. Defaults to `div`.
     *
     * Added 2026-07-29. A frame owns the SHAPE of a box, never the MEANING of its tag, but this
     * one rendered a hard `div` and so decided both. Measured that day, three call-sites could
     * not migrate onto a frame for that reason alone: a list needed `section`, a diagram needed
     * `figure`, and a markdown renderer needed `span` -- the last one load-bearing, because that
     * row of chips sits INSIDE a sentence and a block-level `div` cuts the sentence in three.
     *
     * Screen readers are the other half: `figure` announces a captioned illustration and
     * `section` announces a jumpable region, while `div` announces nothing at all. Forcing every
     * frame to be a `div` quietly took that choice away from the call-site.
     *
     * Typed as a NARROW literal union, not `keyof JSX.IntrinsicElements`. TypeScript resolves a
     * dynamic JSX tag's props as the INTERSECTION of every member of the union, and that
     * intersection includes void elements (`img`, `br`, `input`...) whose `children` type is
     * `never` -- so the full intrinsic-elements union collapses `children`/`className` to `never`
     * for every tag, `div` included. The union here stops at the tags this box actually renders,
     * all of which accept children.
     */
    as?: "div" | "section" | "figure" | "span" | "li"
    /**
     * Render as `inline-flex` instead of `flex`, so the box hugs its content rather than taking
     * the whole line.
     *
     * Added 2026-07-29 alongside `as`. These are two DIFFERENT kinds of box, not two spellings
     * of one: measured on the same content, the block version came out 503px wide and the inline
     * version 136px. `ProgressRing` sits beside running text and must hug -- with only `flex` on
     * offer it wrote the class by hand, twice.
     */
    inline?: boolean
    /** Main axis. Defaults to `row`, the browser default, so the prop reads as an override. */
    direction?: FlexDirection
    /** Space between children, on the house gap scale. Required so nobody leaves it to chance. */
    gap: Responsive<AllowedGap>
    /**
     * Space INSIDE the box, on the house padding scale.
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
    padding?: Responsive<PaddingValue>
    /** Cross axis alignment. `stretch` on a column, `center` on a row, matching the old Stack defaults. */
    align?: LayoutAlign
    /** Main axis distribution. Left out means the browser default, which is `start`. */
    justify?: LayoutJustify
    /**
     * Container step the row switches from wrapped to single-line at -- FRAME-10: a shape
     * change names its width, as a prop, never a bare boolean. Below `at` the row wraps onto a
     * second line; at `at` and above it stays single-line. Meaningless on a column (which
     * already grows without bound), and the render below ignores it there rather than emitting
     * a class that does nothing. Left out (`undefined`) means the row never wraps at all, the
     * same behaviour the old `wrap={false}` default had.
     */
    at?: ResponsiveRowSwitch
    /**
     * `true` → a left guide border + matching indent (`pl-3`, `@app-sm:pl-6`), for a box that
     * is ONE LEVEL DEEPER than its caller. This is `Stack`'s `nested` chrome -- Flex is the tier
     * that actually renders the DOM, and FRAME-5 grants a frame the chrome it draws itself, so
     * the classes live here rather than arriving as a free-form string. `Stack` forwards the
     * boolean the same way it forwards `gap`/`padding`/`align`/`justify`.
     */
    nested?: boolean
    /** The content being laid out. */
    body?: ReactNode
    /**
     * Where this sits inside its parent. Appearance is not passable -- it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises - one token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principle` on the
     * element that carries the gap, so the rendered-tree test can assert the seam is the step
     * the pattern names. Query as `[data-principle="token"]`. A frame does not KNOW its pattern -
     * the caller does - so it is passed in.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, emitted as `data-explain` beside the token.
     * A reason, never a restatement of `principle`.
     */
    explain?: ExplainReason
    /**
     * Caller identity to wear on the ONE element this box renders instead of `Flex`'s own --
     * see `_identity.ts`. Exists here (an internal frame, §the export note below) specifically
     * so `Stack` can forward it: `StackV`/`StackH` render zero DOM of their own -- every Stack
     * instance IS this `Tag`, so a caller badging a Stack root has nowhere else to land the
     * pair. Omitted → this box keeps emitting its own `data-tier="frame" data-component="Flex"`,
     * unchanged.
     */
    identity?: CallerIdentity
}

/** Direction to its literal class. Tailwind never emits an interpolated `flex-${x}`. */
const DIRECTION_CLASS: Record<FlexDirection, string> = {
    row: "flex-row",
    col: "flex-col"}

/** {@link FlexBaseProps.nested} chrome. Centralized so the classes live in exactly one place. */
const NESTED_CLASS = "border-l border-default pl-3 @app-sm:pl-6"

/**
 * {@link ResponsiveRowSwitch} step → the class that takes the row OUT of `flex-wrap` from that
 * step up. Written out per step for the same reason every other breakpoint table in this tier
 * is: Tailwind never emits an interpolated `@app-${step}:flex-nowrap`.
 */
const WRAP_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-nowrap",
    md: "@app-md:flex-nowrap",
    lg: "@app-lg:flex-nowrap",
    xl: "@app-xl:flex-nowrap",
}

/**
 * The one flex box. Renders a single `div` and nothing else, so wrapping something in `Flex`
 * never changes the tree beyond the box the layout needs.
 *
 * @param props - {@link FlexBaseProps}
 */
const FlexBase = ({
    as: Tag = "div",
    inline = false,
    direction = "row",
    gap,
    padding,
    align,
    justify,
    at,
    nested = false,
    body,
    classNames,
    principle,
    explain,
    identity}: FlexBaseProps) => (
    // No self-name fallback: `Flex` is internal-only (see the export note below) and has
    // no story of its own, so a default badge here would only ever point nowhere (§11a.1 rule
    // on undeclared parts). A caller that needs THIS box badged as a node passes ``
    // explicitly, same contract as `Split`/`Cluster`/`SurfaceCard.*`.
    <Tag
        {...resolveIdentity(identity, { tier: "frame", name: "Flex" })}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn(
            inline ? "inline-flex" : "flex",
            DIRECTION_CLASS[direction],
            ...gapClassNames(gap),
            ...(padding != null ? paddingClassNames(padding) : []),
            align != null && ALIGN_CLASS[align],
            justify != null && JUSTIFY_CLASS[justify],
            // A column already grows without bound, so wrapping it would emit a class that can
            // never fire. Ignoring it here keeps the rendered class list honest.
            at != null && direction === "row" && "flex-wrap",
            at != null && direction === "row" && WRAP_SWITCH_CLASS[at],
            nested && NESTED_CLASS,
            classNames)}
    >
        {body}
    </Tag>
)

/** `Flex.*` namespace. One shape, so only `.Base`. */
/**
 * INTERNAL to the frame tier (2026-07-27). `StackV`/`.H` are the public road; this box
 * is what they are built on. It stays exported ONLY because `Stack.tsx` imports it -- no
 * story, and nothing outside `components/frames/` may call it.
 *
 * WHY it is not a public frame: it takes `direction` as a prop, so it can express any
 * one-axis track, which makes it a strictly weaker `Stack` -- same shapes, minus `divider`,
 * minus the axis stated in the name. A public frame that can do everything the constrained
 * one can is not a second option, it is the way the constraint gets bypassed.
 */
export { FlexBase as Flex }

/**
 * Source-level tier marker -- lets a gate read the tier without guessing from the folder path.
 *
 * Known collision, flagged rather than silently resolved: `StackV`/`StackH` render zero DOM
 * of their own -- every Stack instance IS this `Tag`, with no wrapper -- so a rendered Stack's
 * root carries `data-component="Flex"`, not `"StackV"`/`"StackH"`. The tier-marker rule says
 * "hard-coded, not a prop, the component knows what it is", which has no mechanism for one
 * frame built entirely atop another with no element of its own to mark. See `Stack`'s own
 * `meta` export for the fuller note; surfaced here rather than guessed at.
 */
export const meta = { tier: "frame", name: "Flex" } as const
