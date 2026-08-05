import React from "react"
import { Breadcrumbs } from "@/components/atoms/navigation/Breadcrumbs"
import { PageHeader } from "@/components/composites/layout/Page"

/**
 * BLOCK — `CourseQaHeader`: the PAGE-IDENTITY cluster at the top of a course
 * Q&A screen — trail, title, description, nothing else.
 *
 * SIBLING OF `LeaderboardHeader`/`FoundationsHeader`, NOT A COPY. Every ported
 * screen wraps `PageHeader` in its own domain-named block rather than the
 * screen touching the composite directly (rule 1). This board carries no meta
 * row for the same reason `LeaderboardHeader` doesn't: the facts (question
 * count, filter, sort) live in the honest-strip/toolbar below, not the header.
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
