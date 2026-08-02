import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `ConsultantDirectoryHeader` — a BLOCK: the directory identity block at the top
 * of the consultant directory screen — a course-scoped breadcrumb trail, a title,
 * and an optional one-line summary.
 *
 * A sibling of `ContentHeader`/`FoundationsHeader`: all three place identity into
 * the same `PageHeader` frame with a `Breadcrumbs` trail built from crumb DATA, but
 * this one is deliberately thin — no read-state chip, no meta row, no outcomes card,
 * because a consultant directory carries no per-item progress. It earns its layer
 * by building the `Breadcrumbs` atom itself from `breadcrumbItems` and driving
 * `PageHeader`'s title/description slots with the skeleton-vs-real decision.
 *
 * No "no breadcrumb" leaf — the directory is always reached through its course;
 * `breadcrumbItems` is optional only so a Storybook/skeleton consumer can omit it.
 * Losing `description` is a state of the `Default` leaf; `isSkeleton` is its own
 * leaf.
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
