import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationCategoryHeader`: the FOUNDATIONS-HUB IDENTITY cluster —
 * trail above a title + description, nothing else.
 *
 * WHY NEW rather than reusing `ContentHeader`: `ContentHeader` is the wrong
 * SHAPE for this domain, not just a bigger version of it. It always carries a
 * read-state chip, a reading-time/challenge-count meta row, and an "outcomes"
 * list — a Foundations category has none of those facts, and forcing those
 * slots empty on every call site would leave three dead branches nobody
 * exercises. This block is the narrow shape: trail, title, description, done.
 *
 * STILL EARNS ITS OWN LAYER (not a bare `PageHeader` passthrough), because it
 * composes TWO things itself, the exact reason `ContentHeader` gets to exist
 * on top of the same frame:
 *   1. it builds the `Breadcrumbs` atom from crumb DATA (the caller never
 *      hands over a pre-built node — §14d.1);
 *   2. it conditionally OMITS the whole breadcrumb slot when there is no
 *      trail yet (skeleton) or no trail at all (a root category reached
 *      directly, with nothing above it) — a `PageHeader` passthrough could
 *      not make that call, because it does not know what "empty" means for
 *      this domain's crumb data.
 *
 * SIBLING OF `ContentHeader`, NOT A COPY — same frame (`PageHeader`), same
 * "block builds `Breadcrumbs` from data" contract, but this one stops at
 * description: no meta row, no chip, no outcomes card, because the Foundations
 * hub carries none of those facts.
 *
 * CONTRACT — `title`/`description` are the block's only text inputs; there is
 * no `heading` or pre-joined string to accept, so there is nothing left for
 * the block to format (§14d.1 is satisfied trivially here, not bypassed).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface FoundationCategoryHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link FoundationCategoryHeader}. */
export interface FoundationCategoryHeaderProps {
    /**
     * Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. Empty
     * or omitted (and not loading) → the whole breadcrumb slot is left out: a
     * root category reached directly has nothing above it to trail through.
     */
    breadcrumbItems?: Array<FoundationCategoryHeaderCrumb>
    /** Category title. */
    title: string
    /** One-sentence summary of the category. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c), so the shimmer keeps the exact box of the thing it replaces.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Foundations-hub identity cluster: trail, title, description. See the file
 * header for why this stops short of `ContentHeader`'s meta row and outcomes
 * card, and why it still earns its own layer above `PageHeader`.
 *
 * @param props - {@link FoundationCategoryHeaderProps}
 */
const FoundationCategoryHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: FoundationCategoryHeaderProps) => {
    return (
        <div data-anat-part={anatPart}>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                            <Breadcrumbs
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems ?? []}
                                isSkeleton={isSkeleton}
                            />
                        </div>
                    ) : undefined
                }
                title={title}
                description={description}
            />
        </div>
    )
}

export { FoundationCategoryHeader }
