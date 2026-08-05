import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { principlesAttr, type PrincipleToken } from "@sb-components/frames/_principles"

/**
 * `ScrollArea` — a region that SCROLLS its own overflow, on either axis, instead
 * of growing past its box.
 *
 * A scroll region WRAPS one thing — its scrollable content — so it gets ONE named
 * slot, `body`, the same shape as `Container`'s single-slot contract.
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
    principles}: ScrollAreaProps) => (
    <div
        data-tier="frame"
        data-component="ScrollArea"
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
