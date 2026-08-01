import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationsHeader`: the CATEGORY IDENTITY block, answering "what
 * foundations category is this" at the top of a foundations category screen.
 *
 * FOURTH SIBLING of `ContentHeader` (lesson identity), `CourseBrief` (course
 * identity) and `ModuleHeader` (module identity) — NOT a copy of any of them.
 * All four place identity into the same `PageHeader` frame with a
 * `Breadcrumbs` trail, but each answers a different question with different
 * domain fields. See `ContentHeader`'s file header for why that makes each one
 * its own block instead of a prop bolted onto an existing one.
 *
 * ⭐ THINNER THAN ITS SIBLINGS, ON PURPOSE. `ContentHeader` carries a read-state
 * chip, a reading-time/challenge-count meta row and an outcomes list;
 * `ModuleHeader` carries a tier chip and three count pills. This block carries
 * NEITHER — the `src` original (`FoundationsLearnHeader`) never had a meta row
 * or a secondary card, because a foundations category is a plain navigational
 * hub, not a graded unit with its own stats. Inventing a meta row here would be
 * decorating a screen with facts the source never tracked (§14d.3).
 *
 * EARNS ITS LAYER (rule #10) the same way `ContentHeader` does: the block
 * builds the `Breadcrumbs` atom from crumb DATA (`breadcrumbItems`) rather
 * than accepting a pre-built node, and it drives `PageHeader`'s title slot
 * with the exact skeleton-vs-real decision its siblings make. A block that
 * only forwarded `title`/`description` straight into `PageHeader` with no
 * breadcrumb-building step would be a passthrough; building the trail from
 * data is the judgement call that makes this its own layer.
 *
 * NO "NO BREADCRUMB" LEAF, same call `ContentHeader` and `ModuleHeader` make:
 * a foundations category is always reached through home → courses → course →
 * foundations hub → this category, so the trail always exists in the real
 * screen. `breadcrumbItems` stays optional only so a Storybook/skeleton
 * consumer can omit it, not because a real screen ever will.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

export { FoundationsHeader }
