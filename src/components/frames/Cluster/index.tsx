import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Divider } from "@/components/atoms/display/Divider"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { ALIGN_CLASS, gapClassNames, JUSTIFY_CLASS, type AllowedGap, type LayoutAlign, type LayoutJustify, type Responsive } from "@/components/frames/_spacing"
import { principlesAttr, type PrincipleToken } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

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
 * `gap` is a {@link Responsive}<{@link AllowedGap}> and REQUIRED — a chip row is
 * the canonical step `3` seam (peers in one set), but the khung refuses to guess it for you.
 * §13: no domain content, no behaviour — the items' own components carry those.
 * ─────────────────────────────────────────────────────────────────────────────
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
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this track's seam realises — a token from `test-runner/patterns.mjs`.
     * Emitted as `data-principles` on this same root, beside `data-tier`/`data-component`, so the
     * rendered-tree test can assert the seam is the step the pattern names. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    principles?: Array<PrincipleToken>
    /** `true` mounts every item in its loading state. */
    isSkeleton?: boolean
    /**
     * Caller identity to wear on this track's root instead of `Cluster`'s own — pass this when a
     * `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own) is
     * using this track AS its root element, instead of wrapping it in a raw `<div data-tier=…
     * data-component=…>`. See `_identity.ts`. Omitted → this track keeps emitting
     * `data-tier="frame" data-component="Cluster"`, unchanged.
     */
    identity?: CallerIdentity
}

/**
 * The wrapping row. Items render RAW (no per-item wrapper) so an item keeps its
 * own intrinsic width; only under `` is each one wrapped in a
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
    classNames,
    principles,
    isSkeleton,
    identity}: ClusterBaseProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "Cluster" })}
        data-principles={principlesAttr(principles)}
        className={cn(
            "flex flex-wrap",
            ...gapClassNames(gap),
            ALIGN_CLASS[align],
            JUSTIFY_CLASS[justify],
            classNames)}
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
