import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@sb-components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@sb-components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (frame) -- `Stage`: a CANVAS region with chrome FLOATING OVER it. It owns
 * the positioning context, the anchor positions, the z-order and the edge inset
 * so no caller ever writes `absolute`/`relative` again.
 *
 * WHY THIS FRAME EXISTS (teacher's ruling: when vocabulary is missing, CREATE
 * it). Real `src` -- `MindMapPage/index.tsx` -- hand-rolled exactly this shape and
 * flagged its own gap in place, twice over:
 *
 *   • `className="relative"` (~line 315) -- the positioning context for the
 *     ReactFlow canvas, with the comment "the canvas region: the out-of-reach
 *     engine's gap, plus (standalone only) the floating chrome that in the
 *     real app renders as the SAME engine's own Panel children".
 *   • `className="absolute inset-x-0 top-4 z-10"` (~line 230) -- the continue
 *     button, anchored top-center over the canvas.
 *   • `className="absolute bottom-4 left-4 z-10"` (~line 248) -- the legend,
 *     anchored bottom-start.
 *   • `className="absolute bottom-4 right-4 z-10"` (~line 255) -- the
 *     zoom/fullscreen rail, anchored bottom-end.
 *
 * All four sit under one comment reading: *"NEW VOCABULARY GAP: no frame owns
 * 'floating chrome anchored over a canvas' yet -- `AllowedClassName` deliberately
 * excludes `absolute`/`relative`/`fixed`/`sticky` (positioning scheme is a
 * parent composite's call, per its own doc), and `Box` -- the frame tier's
 * escape hatch for exactly that appearance concern -- is explicitly off-limits
 * to a page/block."* This frame IS that parent composite: it decides the
 * positioning scheme once, so a caller's own `classNames` never needs to
 * reach for those four classes at all.
 *
 * FRAME API LAW (§13b): FOUR distinct roles ⇒ FOUR named slots -- one required
 * (`canvas`), three optional floating anchors (`topCenter`/`bottomStart`/
 * `bottomEnd`) -- never a single `children`.
 *
 * `fill` NAMES THE SHAPE, THE INSET STAYS HARD-OWNED (§6c, same discipline as
 * `SplitWorkspace`'s `w-[360px]`/`top-24`). `MindMapPage` hand-wrote
 * `h-[calc(100dvh-4rem)]` TWICE (~line 147, the empty state; ~line 331, the
 * real spine) for its `standalone` shape, where the stage IS the full screen
 * under the app shell's own 4rem of chrome -- that is `fill="viewport"`. Inside
 * `workspace`, the same canvas instead fills whatever a row beside the rail
 * gives it -- that is `fill="parent"`, and the default, since a stage nested
 * inside another frame's own sizing is the more common shape. `top-4`/
 * `bottom-4`/`left-4`/`right-4` are the SAME edge inset in both call sites -- no
 * second shape to generalize for yet; add a prop for it only when a real
 * consumer disagrees.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How {@link Stage} sizes itself against its box -- see the file header. */
export type StageFill = "viewport" | "parent"

/** Props for {@link Stage}. */
export interface StageProps {
    /** The canvas content that fills the region -- REQUIRED, a stage with nothing on it is not a stage. */
    canvas: ComponentTypeWithSkeleton
    /** Chrome anchored top-center, floating over `canvas` (`top-4`, spans the width). */
    topCenter?: ComponentTypeWithSkeleton
    /** Chrome anchored bottom-start, floating over `canvas` (`bottom-4 left-4`). */
    bottomStart?: ComponentTypeWithSkeleton
    /** Chrome anchored bottom-end, floating over `canvas` (`bottom-4 right-4`). */
    bottomEnd?: ComponentTypeWithSkeleton
    /**
     * How the stage sizes itself. `"parent"` (default) fills whatever box its own
     * caller frame gives it. `"viewport"` hard-owns `h-[calc(100dvh-4rem)]` -- the
     * viewport minus the app shell's own 4rem of chrome, the exact shape
     * `MindMapPage`'s `standalone` variant hand-wrote twice (see file header).
     */
    fill?: StageFill
    /** Renders `canvas` and every floating slot in their skeleton state. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable -- it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises - one token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principle` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * Query as `[data-principle="token"]`. A frame does not KNOW its pattern - the caller does - so it is passed in.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, emitted as `data-explain` beside the token.
     * A reason, never a restatement of `principle`.
     */
    explain?: ExplainReason
    /**
     * Caller identity to wear on this stage's root instead of the frame's own -- pass this when
     * a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own)
     * is using this stage AS its root element, instead of wrapping it in a raw `<div
     * data-tier=... data-component=...>`. See `_identity.ts`. Omitted → this stage keeps emitting
     * its own `data-tier="frame" data-component="Stage"`, unchanged.
     */
    identity?: CallerIdentity
}

/** {@link StageFill} → the literal classes that size the stage's own box. */
const FILL_CLASS: Record<StageFill, string> = {
    viewport: "h-[calc(100dvh-4rem)] w-full",
    parent: "h-full w-full"}

/**
 * The canvas-with-floating-chrome stage. See the file header for why this is
 * its own frame and why `fill` is its only sizing prop.
 *
 * @param props - {@link StageProps}
 */
const Stage = ({
    canvas: Canvas,
    topCenter: TopCenter,
    bottomStart: BottomStart,
    bottomEnd: BottomEnd,
    fill = "parent",
    isSkeleton,
    classNames,
    principle,
    explain,
    identity}: StageProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "Stage" })}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn("relative", FILL_CLASS[fill], classNames)}
    >
        {/* `canvas`/`topCenter`/`bottomStart`/`bottomEnd` are CALLER SLOTS -- the node
            inside belongs to whoever passed it, not to this frame, so none gets a
            badge of its own (same restraint as `SplitWorkspace`'s `main`/`aside`). */}
        <div className="h-full w-full">
            <Canvas isSkeleton={isSkeleton} />
        </div>
        {TopCenter && (
            <div className="absolute inset-x-0 top-4 z-10">
                <TopCenter isSkeleton={isSkeleton} />
            </div>
        )}
        {BottomStart && (
            <div className="absolute bottom-4 left-4 z-10">
                <BottomStart isSkeleton={isSkeleton} />
            </div>
        )}
        {BottomEnd && (
            <div className="absolute bottom-4 right-4 z-10">
                <BottomEnd isSkeleton={isSkeleton} />
            </div>
        )}
    </div>
)

export { Stage }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Stage" } as const
