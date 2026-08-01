import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaHeader`: the PAGE IDENTITY cluster at the top of a course
 * Q&A screen — trail, title, description. Nothing else.
 *
 * NOT A NEW IDEA — a thin sibling cloned from the `LeaderboardHeader` /
 * `FoundationsHeader` template (see either file header for the full rationale
 * this repeats): every ported screen wraps `PageHeader` in its own
 * domain-named block rather than the screen touching the composite directly
 * (rule 1), and this keeps that shape even though a Q&A board has less to say
 * up top than `ContentHeader`/`ModuleHeader` do.
 *
 * ⭐ NO META ROW, ON PURPOSE. The real screen's honest-strip/toolbar (question
 * count, filter, sort) carries the facts that would otherwise ride a meta row
 * here. Inventing one on this block would duplicate a fact the toolbar below
 * already owns — the same call `LeaderboardHeader` makes about rank/score
 * living in the list, not the header.
 *
 * EARNS ITS LAYER the same way its siblings do: it builds `Breadcrumbs` from
 * crumb DATA rather than accepting a pre-built node, and it drives
 * `PageHeader`'s title slot with the `isSkeleton` → `Typography` swap idiom
 * every ported header uses. A block that only forwarded `title`/`description`
 * straight through would be a passthrough; building the trail from data is the
 * judgement call that makes this its own layer.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: CourseQaHeaderProps) => {
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

export { CourseQaHeader }
