import React from "react"
import { Breadcrumbs } from "@/components/atoms/navigation/Breadcrumbs"
import { PageHeader } from "@/components/composites/layout/Page"

/**
 * `ConsultantDirectoryHeader` — the directory-identity cluster atop the
 * consultant directory screen: a course-scoped breadcrumb trail, a title, and an
 * optional one-line description. A thin `PageHeader` cluster with no read-state
 * chip or meta row. `description` is optional; `isSkeleton` swaps every atom for
 * its mirror. The breadcrumb trail always exists.
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
