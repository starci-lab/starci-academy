import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `FoundationCategoryHeader` — the Foundations-hub identity cluster: breadcrumb trail,
 * title, description. Builds `Breadcrumbs` from crumb DATA and omits the trail slot
 * when there is none (skeleton, or a root category reached directly). Sibling of
 * `ContentHeader` on the same `PageHeader` frame, but stops at description — no meta
 * row, chip, or outcomes.
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
}: FoundationCategoryHeaderProps) => {
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

export { FoundationCategoryHeader }
