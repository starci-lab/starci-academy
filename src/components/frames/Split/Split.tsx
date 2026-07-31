import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { ALIGN_CLASS, GAP_CLASS, type LayoutAlign, type SeamScale } from "@/components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Split.*`: the TRÁI ↔ PHẢI row (`items-center justify-between`).
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
 * §10: `gap` is a {@link InsetScale} union literal and REQUIRED (off-scale is a
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
     * Seam between the two sides on the §10 scale — REQUIRED, union literal only.
     * It is the MINIMUM distance: `justify-between` pushes the sides apart beyond it.
     */
    gap: SeamScale
    /** Cross-axis alignment of the two sides. Default `center` (the split row's normal). */
    align?: LayoutAlign
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The TRÁI ↔ PHẢI row. See the file header for why the sides are named.
 *
 * @param props - {@link SplitBaseProps}
 */
const SplitBase = ({
    start,
    end,
    gap,
    align = "center",
    classNames,
}: SplitBaseProps) => (
    <div
        className={cn(
            "flex w-full",
            GAP_CLASS[gap],
            "flex-row justify-between",
            ALIGN_CLASS[align],
            classNames,
        )}
    >
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
