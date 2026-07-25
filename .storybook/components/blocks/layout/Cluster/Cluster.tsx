import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import {
    ALIGN_CLASS,
    GAP_CLASS,
    JUSTIFY_CLASS,
    type LayoutAlign,
    type LayoutJustify,
    type SpaceScale,
} from "../../_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Cluster.*`: the WRAPPING row of same-kind small things
 * (chips, tags, filter pills, a bar of buttons). One member, `Cluster.Base`.
 *
 * KHUNG API LAW (§13b) — this is a REPEATING LIST, so the API is `items` DATA
 * and `children` is FORBIDDEN. The test from §13b: "is the content N elements of
 * the SAME kind repeating?" — a chip row answers yes, so it takes data, exactly
 * like `Button.Group items` (§12b). Children would let a caller smuggle a
 * one-off node into a row whose entire premise is uniformity.
 *
 * Cluster vs `Stack.H`: `Stack.H` wraps ARBITRARY children on a row (a heading
 * next to a badge next to a button); `Cluster` repeats ONE kind and always wraps.
 * The two are not interchangeable — pick by the §13b test, not by looks.
 *
 * §10: `gap` is a {@link SpaceScale} union literal and REQUIRED — a chip row is
 * the canonical `related`(2) seam, but the khung refuses to guess it for you.
 * §13: no domain content, no behaviour — the items' own components carry those.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One repeated element of a {@link Cluster.Base}. */
export interface ClusterItem {
    /** Stable React key. */
    key: string
    /** The element itself — a `Chip.Base`, a `Button.Base`, a tag. */
    content: ReactNode
}

/** Props for {@link Cluster.Base}. */
export interface ClusterBaseProps {
    /**
     * The repeated elements, in reading order. REQUIRED — repeat list = DATA,
     * never children (§13b). An empty array renders an empty (zero-height) track:
     * "nothing to show" is the CALLER's state to phrase, not the khung's.
     */
    items: ReadonlyArray<ClusterItem>
    /**
     * Seam between items on the §10 scale — REQUIRED, union literal only. Applies
     * to BOTH axes (row gap and column gap), so wrapped lines breathe the same.
     */
    gap: SpaceScale
    /** Cross-axis alignment WITHIN a line (items of unequal height). Default `center`. */
    align?: LayoutAlign
    /** Main-axis distribution of each line. Default `start`. */
    justify?: LayoutJustify
    className?: string
    /** `true` → tag each item with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The wrapping row. Items render RAW (no per-item wrapper) so an item keeps its
 * own intrinsic width; only under `showAnatomy` is each one wrapped in a
 * badge anchor — a shrink-to-fit `<div>`, layout-neutral on a flex line.
 *
 * @param props - {@link ClusterBaseProps}
 */
const ClusterBase = ({
    items,
    gap,
    align = "center",
    justify = "start",
    className,
    showAnatomy = false,
}: ClusterBaseProps) => (
    <div
        className={cn(
            "flex flex-wrap",
            GAP_CLASS[gap],
            ALIGN_CLASS[align],
            JUSTIFY_CLASS[justify],
            className,
        )}
    >
        {items.map((item) =>
            showAnatomy ? (
                <div key={item.key} data-anat-part="Item">
                    {item.content}
                </div>
            ) : (
                <React.Fragment key={item.key}>{item.content}</React.Fragment>
            ),
        )}
    </div>
)

/**
 * `Cluster.*` — the wrapping same-kind row khung namespace. Namespace only — no
 * bare component export (§13a).
 */
export const Cluster = {
    Base: ClusterBase,
}
