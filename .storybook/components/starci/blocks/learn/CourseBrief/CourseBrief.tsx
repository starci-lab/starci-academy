import React from "react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `CourseBrief` — the course-identity cluster atop a page. It takes crumb DATA
 * (`breadcrumbItems`) and builds the `Breadcrumbs` atom itself, so a screen
 * never holds the `PageHeader` frame or the atom directly. Meta is a muted text
 * strip joined by `·`, not a chip. The two leaves lose a node; a long trail only
 * changes the crumb count, so it is a state.
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface CourseBriefCrumb {
    /** React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → crumb is pressable; the last crumb (current page) leaves it out. */
    onPress?: () => void
}

/** Props for {@link CourseBrief}. */
export interface CourseBriefBaseProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. */
    breadcrumbItems?: Array<CourseBriefCrumb>
    /** Course name. */
    title: string
    /** One-sentence course description. */
    description?: string
    /**
     *  NO pre-formatted `meta` string prop.
     * Passing `meta="8 modules · ~14h · 2,481 learners"` is **breaking the
     * structure**: the caller ends up deciding the join, units, and separator —
     * the block loses ownership of its own shape. Below are separate NUMBER
     * fields; the block joins them itself into a muted strip separated by `·`.
     */
    moduleCount?: number
    /** Total learning hours (rounded) — the block adds `~` and the "hours" word itself. */
    hours?: number
    /** Number of enrolled learners — the block formats the thousands separator itself. */
    learnerCount?: number
    /**
     * `true` → the cluster switches to a mirror shimmer INSTEAD OF waiting for
     * data — the flag FLOWS DOWN to the actual text-rendering atoms/frames
     * (`PageHeader`/`Breadcrumbs`/`Typography`), not a parallel skeleton tree
     * (§12c). `PageHeader` owns `isSkeleton` itself now (it swaps
     * `title`/`description` to shimmer internally), so this block just
     * forwards the flag straight through.
     */
    isSkeleton?: boolean
}

/**
 * Course identity cluster at the top of a page. See the file header for the
 * full contract.
 *
 * @param props - {@link CourseBriefBaseProps}
 */
const CourseBriefBase = ({
    breadcrumbItems,
    title,
    description,
    moduleCount,
    hours,
    learnerCount,
    isSkeleton = false,
}: CourseBriefBaseProps) => {
    // Meta strip joined by the BLOCK from NUMBERS — units, separators, thousands
    // grouping are all presentation; the caller doesn't touch this (§14d.1).
    const metaParts = [
        moduleCount != null ? `${moduleCount} modules` : null,
        hours != null ? `~${hours} hours` : null,
        learnerCount != null ? `${learnerCount.toLocaleString("vi-VN")} learners` : null,
    ].filter(Boolean)

    return (
        // Identity hold: PageHeader does not accept CallerIdentity (ledger PageHeader gap).
        <PageHeader
            isSkeleton={isSkeleton}
            breadcrumb={
                breadcrumbItems?.length
                    ? ({ isSkeleton: skeleton }: SkeletonProps) => (
                        // Hold: no hug-width frame for breadcrumb measure (`w-fit` parent placement).
                        <div className="w-fit">
                            {/* collapse: below @app-sm or trail ≥ 4 crumbs → back-link (the old
                        capability of ResponsiveBreadcrumb, now a prop of the Breadcrumbs atom). */}
                            <Breadcrumbs
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems ?? []}
                                isSkeleton={skeleton}
                            />
                        </div>
                    )
                    : undefined
            }
            title={title}
            description={description}
            meta={
                metaParts.length > 0
                    ? () => (
                        <Typography size="xs" color="muted" text={metaParts.join(" · ")} />
                    )
                    : undefined
            }
        />
    )
}

/** `CourseBrief.*` — single-component namespace ⇒ only `.Base`. */
export { CourseBriefBase as CourseBrief }
