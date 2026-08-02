import React from "react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `CourseBrief` — the course-identity block at the top of a learn surface: breadcrumb
 * trail, title, description. Named for function (a course summary reusable across the
 * sales page and `/learn`), not position. Takes crumb DATA and builds `Breadcrumbs`
 * itself; composes the `PageHeader` frame + `Breadcrumbs` + `Typography` without
 * drawing its own frame. No status chip.
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
     * ⛔ NO pre-formatted `meta` string prop.
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
     * data — the flag FLOWS DOWN to the actual text-rendering atoms
     * (`Breadcrumbs`/`Typography`), not a parallel skeleton tree
     * (§12c).
     *
     * ⚠️ `PageHeader` (the frame wrapping `title`/`description`) does NOT have
     * `isSkeleton` yet and sits OUTSIDE the 4 files edited this round — the
     * block can't pass the flag through it. For those two slots, the block
     * calls the `Typography isSkeleton` atom DIRECTLY (matching the
     * size/weight `PageHeader` itself uses for `title`/`description`) and
     * feeds the RESULT into the slot instead of a raw string — still "flag
     * flows down to the atom", just a different PLACE that calls the atom.
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
        <div>
            <PageHeader

                breadcrumb={
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit">
                            {/* collapse: below @app-sm or trail ≥ 4 crumbs → back-link (the old
                        capability of ResponsiveBreadcrumb, now a prop of the Breadcrumbs atom). */}
                            <Breadcrumbs
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems ?? []}
                                isSkeleton={isSkeleton}
                            />
                        </div>
                    ) : undefined
                }
                title={
                    isSkeleton ? (
                        // `PageHeader` has no `isSkeleton` yet (outside this round's edit
                        // boundary) — call the `Typography` atom directly with the EXACT
                        // size/weight `PageHeader` itself uses for `title` (size="h3"
                        // weight="bold"), then feed the result into the slot.
                        <Typography size="h3" weight="bold" isSkeleton />
                    ) : (
                        <span>{title}</span>
                    )
                }
                description={
                    isSkeleton ? (
                        // Same reasoning — `PageHeader` uses size="sm" color="muted" for
                        // description; call that atom directly instead of a raw string. ALWAYS
                        // show this line while loading (even when the final call site leaves
                        // description empty) — it's the most common line in the cluster; keeping
                        // the layout stable (§8) matters more than saving one shimmer line for
                        // the rare case with no description.
                        <Typography size="sm" color="muted" isSkeleton />
                    ) : (
                        description
                    )
                }
                meta={
                    isSkeleton ? (
                        <Typography size="xs" color="muted" isSkeleton classNames={["w-2/3"]} />
                    ) : metaParts.length > 0 ? (
                        <span>
                            <Typography size="xs" color="muted" text={metaParts.join(" · ")} />
                        </span>
                    ) : undefined
                }
            />
        </div>
    )
}

/** `CourseBrief.*` — single-component namespace ⇒ only `.Base`. */
export { CourseBriefBase as CourseBrief }
