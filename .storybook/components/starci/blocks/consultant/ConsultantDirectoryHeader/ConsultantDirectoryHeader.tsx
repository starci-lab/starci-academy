import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ConsultantDirectoryHeader`: the DIRECTORY IDENTITY block, answering
 * "what directory is this" at the top of the consultant directory screen —
 * a course-scoped breadcrumb trail, a title and an optional one-line summary.
 *
 * SIBLING OF `ContentHeader`/`FoundationsHeader`, NOT A COPY of either. All
 * three place identity into the same `PageHeader` frame with a `Breadcrumbs`
 * trail built from crumb DATA, but each answers a different question. This one
 * is deliberately as THIN as `FoundationsHeader`: no read-state chip, no
 * reading-time/challenge-count meta row, no outcomes card — a consultant
 * directory carries no per-item progress, so there is nothing to summarize in
 * a meta row. Inventing one here would be decorating with facts this screen
 * never tracks (§14d.3), same call `FoundationsHeader`'s file header makes.
 *
 * EARNS ITS LAYER (rule #10) the same way its siblings do: the block builds
 * the `Breadcrumbs` atom itself from `breadcrumbItems` DATA rather than
 * accepting a pre-built node, and it drives `PageHeader`'s title/description
 * slots with the exact skeleton-vs-real decision its siblings make. A block
 * that only forwarded `title`/`description` straight into `PageHeader` with
 * no breadcrumb-building step would be a passthrough.
 *
 * ⛔ NO "no breadcrumb" leaf, same call `ContentHeader`/`FoundationsHeader`
 * make: the directory is always reached through its course, so the trail
 * always exists on the real screen. `breadcrumbItems` stays optional only so
 * a Storybook/skeleton consumer can omit it.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Losing `description` is the same magnitude
 * as `FoundationsHeader`'s own description toggle — one atom node inside an
 * already-composed frame — so it stays a STATE of the `Default` leaf. The
 * caller flipping `isSkeleton` swaps every composed atom for its own mirror,
 * which is its own leaf, same as `ContentHeader`/`FoundationsHeader`'s
 * `Skeleton` leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface ConsultantDirectoryHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link ConsultantDirectoryHeader}. */
export interface ConsultantDirectoryHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself (course → consultant directory). */
    breadcrumbItems?: Array<ConsultantDirectoryHeaderCrumb>
    /** Directory title. */
    title: string
    /** One-sentence summary of what the directory lists. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The directory identity cluster at the top of the consultant directory
 * screen. See the file header for the full contract and why this is a thin
 * sibling of `ContentHeader`/`FoundationsHeader` rather than an edit of
 * either.
 *
 * @param props - {@link ConsultantDirectoryHeaderProps}
 */
const ConsultantDirectoryHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
}: ConsultantDirectoryHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit">
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

export { ConsultantDirectoryHeader }
