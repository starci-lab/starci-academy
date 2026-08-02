import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { ALIGN_CLASS, gapClassNames, JUSTIFY_CLASS, type AllowedGap, type LayoutAlign, type LayoutJustify, type Responsive } from "@sb-components/frames/_spacing"

/**
 * `Cluster` — a repeating-list frame: a wrapping row of N elements of the same kind
 * (chip/tag/button). Produces `gap`, `justify`, `align`. A cluster always wraps by definition
 * (a row that may or may not wrap is `StackH`); an empty list just leaves an empty track, since
 * a frame carries no content.
 */

/** Props for {@link Cluster}. */
export interface ClusterBaseProps {
    /**
     * The repeated elements, in reading order — each an UNCALLED component reference
     * the frame mounts itself (`<Item isSkeleton={isSkeleton} />`), never a built
     * `ReactNode` (§ content must be buildable). Repeat list = DATA, never children
     * (§13b). An empty/omitted array renders an empty (zero-height) track: "nothing
     * to show" is the CALLER's state to phrase, not the khung's.
     */
    items?: Array<ComponentTypeWithSkeleton>
    /**
     * Seam between items on the house gap scale (`gap.md`) — REQUIRED. Applies to BOTH axes
     * (row gap and column gap), so wrapped lines breathe the same. `3` (`gap-2`) is the
     * canonical step for a chip row — peers in one set — but the frame refuses to guess it
     * for you. Responsive: `gap={{ base: 2, md: 3 }}` tightens the seam in a narrow container.
     */
    gap: Responsive<AllowedGap>
    /**
     * `true` puts a `·` BETWEEN items, N items get N-1 marks, mirroring `Stack`'s `divider`.
     *
     * A `·` sitting between two meta fragments is not content, it is how the
     * TRACK marks the boundary between its items, so it belongs to the frame the same way a
     * rule does. The mark carries no margin because the track's own `gap` already
     * spaces it, and it is not an item so it never becomes a node.
     */
    separator?: boolean
    /** Cross-axis alignment WITHIN a line (items of unequal height). Default `center`. */
    align?: LayoutAlign
    /** Main-axis distribution of each line. Default `start`. */
    justify?: LayoutJustify
    /**
     * Anatomy tag for THIS khung itself — lets the PARENT badge it as ONE node.
     *
     * Without this prop the parent can't name the khung, so the khung
     * doesn't make it into the Deps tree and it counts as unused.
     */
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this track's seam realises — a token from `test-runner/patterns.mjs`.
     * Emitted as `data-principles` on this same root, beside `data-tier`/`data-component`, so the
     * rendered-tree test can assert the seam is the step the pattern names. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    pattern?: string
    /** `true` mounts every item in its loading state. */
    isSkeleton?: boolean
}

/**
 * The wrapping row. Items render RAW (no per-item wrapper) so an item keeps its
 * own intrinsic width on the flex line.
 *
 * @param props - {@link ClusterBaseProps}
 */
const ClusterBase = ({
    items,
    gap,
    align = "center",
    justify = "start",
    separator = false,
    classNames,
    pattern,
    isSkeleton,
}: ClusterBaseProps) => (
    <div
        data-tier="frame"
        data-component="Cluster"

        data-principles={pattern}
        className={cn(
            "flex flex-wrap",
            ...gapClassNames(gap),
            ALIGN_CLASS[align],
            JUSTIFY_CLASS[justify],
            classNames,
        )}
    >
        {(items ?? []).map((Item, index) => {
            // The wrapper is unconditional; only the badge on it is not. Rendering it only when
            // the overlay is on made the overlay change what it was measuring — the wrapper is a
            // flex child, so turning inspection on moved the row it was meant to describe.
            const body = <div><Item isSkeleton={isSkeleton} /></div>
            return (
                <React.Fragment key={index}>
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

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Cluster" } as const
