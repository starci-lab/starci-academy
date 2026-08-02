import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { ALIGN_CLASS, gapClassNames, type AllowedGap, type LayoutAlign, type Responsive } from "@sb-components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Split.*`: the LEFT ↔ RIGHT row (`items-center justify-between`).
 * One member, `Split`: the shape has no second form — a split is a split.
 *
 * WHY IT IS ITS OWN KHUNG and not "a `StackH` with `justify=between`": the row
 * appears 43× across the app (card title ↔ action, label ↔ value, price ↔ CTA)
 * and it is not one track of N children — it is TWO NAMED SIDES with different
 * width strategies: `start` may truncate (`min-w-0`), `end` must never be
 * squeezed (`shrink-0`). Naming the sides is what makes that rule enforceable in
 * ONE place instead of at 43 call sites.
 *
 * KHUNG API LAW (§13b): two NAMED SLOTS (`start`/`end`) are the whole content
 * contract → NO `children`. Children would reopen the "which child goes where"
 * question the named slots exist to close.
 *
 * `gap` is a {@link Responsive}<{@link AllowedGap}> and REQUIRED (off-scale is a
 * type error). §13: no domain content, no behaviour — placement only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link Split}. */
export interface SplitBaseProps {
    /**
     * LEADING side (the reading-flow anchor: title, label, primary text). Rendered
     * `min-w-0` so long text truncates INSIDE this side instead of pushing `end` out.
     */
    start: ReactNode
    /**
     * TRAILING side (action, value, meta). Rendered `shrink-0` — the trailing
     * control keeps its size and the leading side gives way first.
     */
    end: ReactNode
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
}: SplitBaseProps) => (
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
            {start}
        </div>
        <div className="shrink-0">
            {end}
        </div>
    </div>
)

/**
 * `Split.*` — the left↔right row khung namespace. Namespace only — no bare
 * component export (§13a).
 */
export { SplitBase as Split }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Split" } as const
