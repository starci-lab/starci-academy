import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `CourseQaHeader` — the page-identity cluster at the top of a course Q&A screen:
 * breadcrumb trail, title, description. Builds `Breadcrumbs` from crumb DATA and drives
 * `PageHeader`'s title slot with the `isSkeleton` → `Typography` swap. No meta row
 * (the toolbar below owns question count / filter / sort).
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface CourseQaHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link CourseQaHeader}. */
export interface CourseQaHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. */
    breadcrumbItems?: Array<CourseQaHeaderCrumb>
    /** Page title, e.g. "Q&A". */
    title: string
    /** One-sentence description of what this Q&A board is for. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c), so the shimmer keeps the exact box of the thing it replaces.
     */
    isSkeleton?: boolean
}

/**
 * Course Q&A page identity — trail, title, description. See the file header
 * for why this stays a thin sibling of `LeaderboardHeader`/`FoundationsHeader`
 * rather than a fresh idea.
 *
 * @param props - {@link CourseQaHeaderProps}
 */
const CourseQaHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
}: CourseQaHeaderProps) => {
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

export { CourseQaHeader }
