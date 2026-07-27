import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { ALIGN_CLASS, GAP_CLASS, type LayoutAlign, type SeamScale } from "@sb-components/frames/_spacing"

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

/**
 * Cross-axis alignment applied once the row IS a row — mirrors {@link ALIGN_CLASS}
 * at the `@app-sm` CONTAINER step, for {@link SplitBaseProps.stackOnMobile}.
 *
 * `@app-*` (not `sm:`) on purpose: the app shell is a split column that a docked
 * rail can narrow, so a khung must respond to ITS CONTAINER's width, never to the
 * window's (see `globals.css` → `--container-app-*`, pinned to the viewport scale).
 */
const SM_ALIGN_CLASS: Record<LayoutAlign, string> = {
    start: "@app-sm:items-start",
    center: "@app-sm:items-center",
    end: "@app-sm:items-end",
    stretch: "@app-sm:items-stretch",
    baseline: "@app-sm:items-baseline",
}

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
    /**
     * `true` → below the `@app-sm` container step the row becomes a COLUMN
     * (`start` above `end`, both full width) and returns to a split row from
     * `@app-sm` up. For rows whose trailing side is too wide for a narrow shell.
     */
    stackOnMobile?: boolean
    /**
     * Anatomy tag cho CHÍNH khung này — để CHA badge nó như MỘT node (§11a.1).
     * Thiếu prop này thì khung không vào được cây Deps: dùng khung tầng `layouts` mà
     * panel không thấy nó thì coi như chưa dùng.
     */
    anatPart?: string
    className?: string
    /** `true` → tag this khung's parts with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    stackOnMobile = false,
    className,
    showAnatomy = false,
    anatPart,
}: SplitBaseProps) => (
    <div
        data-anat-part={anatPart}
        className={cn(
            "flex w-full",
            GAP_CLASS[gap],
            stackOnMobile
                // Stacked first: full-width column, then the split row from `@app-sm`.
                ? ["flex-col items-stretch", "@app-sm:flex-row @app-sm:justify-between", SM_ALIGN_CLASS[align]]
                : ["flex-row justify-between", ALIGN_CLASS[align]],
            className,
        )}
    >
        {/* No `data-anat-part` on these two wrappers (2026-07-28): `start`/`end` are CALLER
            slots — whatever they render (a `Typography`, a `Button`, a `StackV`)
            belongs to the caller's own anatomy, not to this khung's. Badging the wrapper as
            "Start"/"End" would claim the caller's content as this frame's own part, and no
            story ever declared either name (no component sits behind them to link to), so
            the badge only ever rendered into the DOM invisibly. */}
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
