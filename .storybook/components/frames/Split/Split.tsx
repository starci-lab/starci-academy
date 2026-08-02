import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { ALIGN_CLASS, gapClassNames, type AllowedGap, type LayoutAlign, type Responsive } from "@sb-components/frames/_spacing"

/**
 * `Split` — a LAYOUT frame: the left ↔ right row (`items-center
 * justify-between`). One member; a split has no second form.
 *
 * Two NAMED sides with different width strategies: `start` may truncate
 * (`min-w-0`), `end` must never be squeezed (`shrink-0`). Naming the sides makes
 * that rule enforceable in one place. Two named slots (`start`/`end`) are the
 * whole content contract ⇒ no `children`.
 *
 * `gap` is a {@link Responsive}<{@link AllowedGap}> and REQUIRED (off-scale is a
 * type error). No domain content, no behaviour — placement only.
 */

/** Props for {@link Split}. */
export interface SplitBaseProps {
    /**
     * LEADING side (the reading-flow anchor: title, label, primary text). Rendered
     * `min-w-0` so long text truncates INSIDE this side instead of pushing `end` out.
     * An UNCALLED component reference — the frame mounts it itself
     * (`<Start isSkeleton={isSkeleton} />`), never a built `ReactNode`.
     */
    start: ComponentTypeWithSkeleton
    /**
     * TRAILING side (action, value, meta). Rendered `shrink-0` — the trailing
     * control keeps its size and the leading side gives way first. An UNCALLED
     * component reference, mounted the same way as `start`.
     */
    end: ComponentTypeWithSkeleton
    /**
     * Seam between the two sides on the house gap scale — REQUIRED. It is the MINIMUM
     * distance: `justify-between` pushes the sides apart beyond it.
     */
    gap: Responsive<AllowedGap>
    /** Cross-axis alignment of the two sides. Default `center` (the split row's normal). */
    align?: LayoutAlign
    /**
     * Anatomy tag for THIS frame itself — so the PARENT can badge it as ONE node (§11a.1).
     * Without this prop the frame never enters the Deps tree: using a `layouts`-tier frame
     * that the panel can't see counts as not using it at all.
     */
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     */
    pattern?: string
    /** `true` mounts both sides in their loading state. */
    isSkeleton?: boolean
}

/**
 * The LEFT ↔ RIGHT row. See the file header for why the sides are named.
 *
 * @param props - {@link SplitBaseProps}
 */
const SplitBase = ({
    start,
    end,
    gap,
    align = "center",
    classNames,
    pattern,
    isSkeleton,
}: SplitBaseProps) => {
    const Start = start
    const End = end
    return (
        <div
            data-tier="frame"
            data-component="Split"

            data-principles={pattern}
            className={cn(
                "flex w-full",
                ...gapClassNames(gap),
                "flex-row justify-between",
                ALIGN_CLASS[align],
                classNames,
            )}
        >
            {/* `start`/`end` are CALLER slots — whatever they render (a `Typography`, a
                `Button`, a `StackV`) belongs to the caller, not to this frame. */}
            <div className="min-w-0">
                <Start isSkeleton={isSkeleton} />
            </div>
            <div className="shrink-0">
                <End isSkeleton={isSkeleton} />
            </div>
        </div>
    )
}

/**
 * `Split.*` — the left↔right row khung namespace. Namespace only — no bare
 * component export (§13a).
 */
export { SplitBase as Split }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Split" } as const
