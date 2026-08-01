import React from "react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundHubHeader`: the HUB IDENTITY block, answering "what is
 * this playground hub" at the top of the Docker/Kubernetes exercise grid.
 *
 * SIBLING of `ContentHeader`/`FoundationsHeader`/`ModuleHeader` — NOT a copy of
 * any of them. All four place identity into the same `PageHeader` frame, but
 * each answers a different question with different domain fields. See
 * `ContentHeader`'s file header for why that makes each one its own block
 * instead of a prop bolted onto an existing one.
 *
 * ⭐ THINNEST OF THE FOUR, ON PURPOSE. The real `PlaygroundHub`
 * (`src/components/features/learn/Playground/PlaygroundHub/index.tsx`) renders
 * only a title and a muted subtitle — no breadcrumb, no meta row, no chip. A
 * hub is a flat entry point reached straight from the course nav, not a
 * graded unit with its own stats or a trail of parents. Inventing a
 * breadcrumb or a stat row here would be decorating with facts the source
 * never tracked (§14d.3) — same discipline `FoundationsHeader`'s file header
 * documents for itself.
 *
 * EARNS ITS LAYER (rule #10) the same way its siblings do: it is not a bare
 * passthrough onto `PageHeader`, because it OWNS the skeleton-vs-real decision
 * for the title/description slots — `PageHeader` has no `isSkeleton` of its
 * own, so this block calls `Typography` directly with the exact size/weight
 * the frame uses and feeds the result into the slot. That decision, not the
 * wiring, is what makes this its own tier rather than a straight forward of
 * two strings.
 *
 * ONE LEAF, NOT TWO (§14d.2). Unlike `ContentHeader`/`FoundationsHeader`,
 * which split `Full`/`Skeleton` into separate leaves because their skeleton
 * swaps an outcomes card or a breadcrumb row along with the text, this block
 * has nothing else to lose — `isSkeleton` only changes which state the
 * composed `Typography` renders (shimmer vs. real string) inside the exact
 * same `PageHeader` shape. That is a STATE, not a structural change, so
 * `Default` carries both as states of one leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PlaygroundHubHeader}. */
export interface PlaygroundHubHeaderProps {
    /** Hub title, e.g. "Playground". */
    title: string
    /** One-sentence purpose line explaining what the hub is for. */
    description?: string
    /**
     * `true` → the composed `Typography` slots switch to their own shimmer.
     * The flag FLOWS DOWN into the real atoms rather than building a parallel
     * skeleton tree (§12c).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The playground-hub identity cluster at the top of the exercise grid. See
 * the file header for the full contract and why this stays thinner than its
 * `ContentHeader`/`FoundationsHeader` siblings.
 *
 * @param props - {@link PlaygroundHubHeaderProps}
 */
const PlaygroundHubHeader = ({
    title,
    description,
    isSkeleton = false,
}: PlaygroundHubHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                title={title}
                description={description}
            />
        </div>
    )
}

export { PlaygroundHubHeader }
