import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { principlesAttr, type PrincipleToken } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (frame) — `ScrollArea`: a region that SCROLLS its own overflow, on
 * either axis, instead of growing past its box.
 *
 * ⭐ WHY THIS FRAME EXISTS (teacher's ruling: when vocabulary is missing, CREATE
 * it). Real `src` — `MindMapPage/index.tsx` (~line 296) — hand-rolled exactly
 * this shape around the search rail's own content, with the comment in place:
 * *"NEW VOCABULARY GAP: no frame carries a scrollable-region flag
 * (`overflow-y-auto`) yet — `ResizableRail`/`RailShell` own width and the
 * handle only. Kept as minimal raw markup until one does."* This frame is that
 * flag.
 *
 * FRAME API LAW (§13b): a scroll region WRAPS one thing — its scrollable
 * content — so it gets ONE named slot, `body`, the same shape as
 * `Container`'s single-slot contract (a wrapping frame that is not a repeat
 * list takes a slot, never `items`).
 *
 * ⭐ `axis` NAMES THE DIRECTION. `MindMapPage`'s one real call site scrolls
 * vertically only (`overflow-y-auto`), which is also the dominant shape
 * anywhere content outgrows its box — so `axis` defaults to `"y"` and an
 * unmigrated caller would render identically. `"x"`/`"both"` are offered
 * up front rather than bolted on later: `overflow-x-auto`/`overflow-auto` are
 * the only other two members `overflow-*` actually has for "scroll, don't
 * clip", so the union is already complete, not grown speculatively.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which axis {@link ScrollArea} scrolls — see the file header. */
export type ScrollAreaAxis = "y" | "x" | "both"

/** Props for {@link ScrollArea}. */
export interface ScrollAreaProps {
    /** The scrollable content — an uncalled `ComponentType<{isSkeleton?}>` this frame renders itself. */
    body: ComponentTypeWithSkeleton
    /** Which axis scrolls. Defaults to `"y"` — the dominant shape (see file header). */
    axis?: ScrollAreaAxis
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     */
    principles?: Array<PrincipleToken>
    /**
     * Caller identity to wear on this region's root instead of the frame's own — pass this when
     * a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own)
     * is using this region AS its root element, instead of wrapping it in a raw `<div
     * data-tier=… data-component=…>`. See `_identity.ts`. Omitted → this region keeps emitting
     * its own `data-tier="frame" data-component="ScrollArea"`, unchanged.
     */
    identity?: CallerIdentity
}

/** {@link ScrollAreaAxis} → literal `overflow-*` class. */
const AXIS_CLASS: Record<ScrollAreaAxis, string> = {
    y: "overflow-y-auto",
    x: "overflow-x-auto",
    both: "overflow-auto"}

/**
 * The overflow-scrolls-instead-of-grows region. See the file header for why
 * this is its own frame and why `axis` is its only prop beyond `body`.
 *
 * @param props - {@link ScrollAreaProps}
 */
const ScrollArea = ({
    body: Body,
    axis = "y",
    isSkeleton,
    classNames,
    principles,
    identity}: ScrollAreaProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "ScrollArea" })}
        data-principles={principlesAttr(principles)}
        className={cn(AXIS_CLASS[axis], classNames)}
    >
        {/* `body` is a CALLER SLOT — the node inside belongs to whoever passed it, not to
            this frame, so it gets no badge of its own (same restraint as `Container.body`). */}
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { ScrollArea }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "ScrollArea" } as const
