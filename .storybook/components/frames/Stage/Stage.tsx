import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { principlesAttr, type PrincipleToken } from "@sb-components/frames/_principles"

/**
 * `Stage` — a CANVAS region with chrome FLOATING OVER it. It owns the positioning
 * context, the anchor positions, the z-order and the edge inset so no caller ever
 * writes `absolute`/`relative` again.
 *
 * FOUR distinct roles ⇒ FOUR named slots — one required (`canvas`), three optional
 * floating anchors (`topCenter`/`bottomStart`/`bottomEnd`) — never a single `children`.
 */

/** How {@link Stage} sizes itself against its box — see the file header. */
export type StageFill = "viewport" | "parent"

/** Props for {@link Stage}. */
export interface StageProps {
    /** The canvas content that fills the region — REQUIRED, a stage with nothing on it is not a stage. */
    canvas: ComponentTypeWithSkeleton
    /** Chrome anchored top-center, floating over `canvas` (`top-4`, spans the width). */
    topCenter?: ComponentTypeWithSkeleton
    /** Chrome anchored bottom-start, floating over `canvas` (`bottom-4 left-4`). */
    bottomStart?: ComponentTypeWithSkeleton
    /** Chrome anchored bottom-end, floating over `canvas` (`bottom-4 right-4`). */
    bottomEnd?: ComponentTypeWithSkeleton
    /**
     * How the stage sizes itself. `"parent"` (default) fills whatever box its own
     * caller frame gives it. `"viewport"` hard-owns `h-[calc(100dvh-4rem)]` — the
     * viewport minus the app shell's own 4rem of chrome.
     */
    fill?: StageFill
    /** Renders `canvas` and every floating slot in their skeleton state. */
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
    principles}: StageProps) => (
    <div
        data-tier="frame"
        data-component="Stage"
        data-principles={principlesAttr(principles)}
        className={cn("relative", FILL_CLASS[fill], classNames)}
    >
        {/* `canvas`/`topCenter`/`bottomStart`/`bottomEnd` are CALLER SLOTS — the node
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

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Stage" } as const
