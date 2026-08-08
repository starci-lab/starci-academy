import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `FoundationsHeader` — the category-identity cluster at the top of a foundations
 * category screen: a breadcrumb trail (home → courses → course → foundations hub →
 * this category), a title, and an optional description. Deliberately thin — a
 * foundations category is a navigational hub, so no read-state chip, meta row, or
 * secondary card. The description may drop out; `isSkeleton` swaps every composed
 * atom for its mirror.
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface FoundationsHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link FoundationsHeader}. */
export interface FoundationsHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself (home → courses → course → foundations hub → this category). */
    breadcrumbItems?: Array<FoundationsHeaderCrumb>
    /** Category title. */
    title: string
    /** One-sentence summary of the category. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
}

/**
 * The foundations-category identity cluster at the top of a foundations
 * category screen. See the file header for the full contract and why this is
 * a thinner sibling of `ContentHeader`/`CourseBrief`/`ModuleHeader` rather
 * than an edit of any of them.
 *
 * @param props - {@link FoundationsHeaderProps}
 */
const FoundationsHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
}: FoundationsHeaderProps) => {
    return (
        // Identity hold: PageHeader does not accept CallerIdentity (ledger PageHeader gap).
        <PageHeader
            isSkeleton={isSkeleton}
            breadcrumb={() =>
                isSkeleton || breadcrumbItems?.length ? (
                    // Hold: no hug-width frame for breadcrumb measure (`w-fit` parent placement).
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
    )
}

export { FoundationsHeader }
