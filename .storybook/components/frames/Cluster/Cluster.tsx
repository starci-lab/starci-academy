import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { ALIGN_CLASS, GAP_CLASS, JUSTIFY_CLASS, type LayoutAlign, type LayoutJustify, type SeamScale } from "@sb-components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Cluster.*`: the WRAPPING row of same-kind small things
 * (chips, tags, filter pills, a bar of buttons). One member, `Cluster`.
 *
 * KHUNG API LAW (§13b) — this is a REPEATING LIST, so the API is `items` DATA
 * and `children` is FORBIDDEN. The test from §13b: "is the content N elements of
 * the SAME kind repeating?" — a chip row answers yes, so it takes data, exactly
 * like `ButtonGroup items` (§12b). Children would let a caller smuggle a
 * one-off node into a row whose entire premise is uniformity.
 *
 * Cluster vs `StackH`: `StackH` wraps ARBITRARY children on a row (a heading
 * next to a badge next to a button); `Cluster` repeats ONE kind and always wraps.
 * The two are not interchangeable — pick by the §13b test, not by looks.
 *
 * §10: `gap` is a {@link InsetScale} union literal and REQUIRED — a chip row is
 * the canonical `related`(2) seam, but the khung refuses to guess it for you.
 * §13: no domain content, no behaviour — the items' own components carry those.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One repeated element of a {@link Cluster}. */
export interface ClusterItem {
    /** Stable React key. */
    key: string
    /** The element itself — a `Chip`, a `Button`, a tag. */
    content: ReactNode
}

/** Props for {@link Cluster}. */
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
    gap: SeamScale
    /**
     * `true` puts a `·` BETWEEN items, N items get N-1 marks, mirroring `Stack`'s `divider`.
     *
     * ⭐ 2026-07-27. A `·` sitting between two meta fragments is not content, it is how the
     * TRACK marks the boundary between its items, so it belongs to the frame the same way a
     * rule does. Written as content it caused two separate bugs: a hand-typed `mx-1` for its
     * breathing room, which the padding gate then reported as a child pushing its own margin,
     * and a node in the structure tree named `Separator` whose link went to the generic
     * Typography story, so three different roles all pointed at the same unrelated page.
     *
     * Both disappear here: the mark carries no margin because the track's own `gap` already
     * spaces it, and it is not an item so it never becomes a node.
     */
    separator?: boolean
    /** Cross-axis alignment WITHIN a line (items of unequal height). Default `center`. */
    align?: LayoutAlign
    /** Main-axis distribution of each line. Default `start`. */
    justify?: LayoutJustify
    /**
     * Anatomy tag for THIS khung itself — lets the PARENT badge it as ONE node (§11a.1).
     *
     * ⭐ 2026-07-27: without this prop the parent can't name the khung, so the khung
     * doesn't make it into the Deps tree — use a `layouts`-tier khung and have the panel
     * still not see it, and it counts as unused. Same gap already patched on
     * `PageHeader`/`Divider`/`ChoiceSwitch`.
     */
    anatPart?: string
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    separator = false,
    className,
    classNames,
    showAnatomy = false,
    anatPart,
}: ClusterBaseProps) => (
    <div
        data-anat-part={anatPart}
        className={cn(
            "flex flex-wrap",
            GAP_CLASS[gap],
            ALIGN_CLASS[align],
            JUSTIFY_CLASS[justify],
            className,
            classNames,
        )}
    >
        {items.map((item, index) => {
            const body = showAnatomy
                ? <div data-anat-part="Item">{item.content}</div>
                : item.content
            return (
                <React.Fragment key={item.key}>
                    {/* The mark carries no margin of its own — the track's `gap` already
                        spaces it — so `Divider`'s inline shape reproduces it exactly. */}
                    {separator && index > 0 ? <Divider shape="inline" /> : null}
                    {body}
                </React.Fragment>
            )
        })}
    </div>
)

/**
 * `Cluster.*` — the wrapping same-kind row khung namespace. Namespace only — no
 * bare component export (§13a).
 */
export { ClusterBase as Cluster }
