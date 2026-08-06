import React from "react"
import {
    AsyncContentEmpty,
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    CourseHero,
} from "./CourseHero"
import {
    CourseValueProps,
} from "./CourseValueProps"
import {
    CourseCurriculum,
} from "./CourseCurriculum"
import {
    CoursePrerequisites,
} from "./CoursePrerequisites"
import {
    CourseFaq,
} from "./CourseFaq"
import {
    CoursePricingRail,
} from "./CoursePricingRail"
import {
    CourseMobileEnrollBar,
} from "./CourseMobileEnrollBar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Already-translated copy {@link _CourseDetailPage} needs — resolved by the connected `CourseDetailPage`. */
export interface CourseDetailLabels {
    /** Shown when the course fetch settles with no course to show. */
    notFound: string
    /** Shown when the course fetch settles with an error. */
    errorTitle: string
    /** Retry-button label on the error branch. */
    retry: string
}

/** Props for {@link _CourseDetailPage} — presentational; all data resolved, no fetch/store/i18n. */
export type CourseDetailPageProps = WithClassNames<undefined> & {
    /**
     * First load, nothing in hand → the spine mirrors itself in place (co-located). Owned by
     * the connected `CourseDetailPage` (first-load formula, `loading-and-skeleton.md` §2).
     */
    isSkeleton?: boolean
    /** Settled with no course → the not-found message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats a stale loading flag and the empty branch). */
    error?: unknown
    /** Retry handler paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** Already-translated copy — see {@link CourseDetailLabels}. */
    labels: CourseDetailLabels
}

/**
 * Marketing-first course landing (UI 2.0) — the presentational half of {@link CourseDetailPage}: a
 * full-width hero (value + social proof + CTA above the fold), then a two-column body — narrative
 * on the left (what-you'll-learn → curriculum → before-you-start → FAQ) and a sticky pricing rail
 * on the right — plus a mobile sticky enroll bar. Replaces the legacy `layouts/course/Course`.
 *
 * `error` beats a stale loading flag; the not-found surface only shows once loading has settled
 * (`!isSkeleton && isEmpty`) — both are the shared `AsyncContentError`/`AsyncContentEmpty` frames,
 * never hand-written JSX (`loading-and-skeleton.md` §6). Every section below (`CourseHero`,
 * `CoursePricingRail`, `CourseValueProps`, `CourseCurriculum`, `CoursePrerequisites`, `CourseFaq`,
 * `CourseMobileEnrollBar`) is a self-fetching CONNECTED child — each reads the hydrated course from
 * redux itself (`tiers/split.md`: a presentational file may render a connected child) and takes no
 * `isSkeleton` prop of its own, so while shimmering this ONE tree mirrors their exact positions with
 * `Skeleton.*` right where each child sits instead (`loading-and-skeleton.md` §1's "no `isSkeleton`
 * prop → mirror minimally, co-located, not a parallel tree"). See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link CourseDetailPageProps}
 */
const _CourseDetailPage = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    labels,
}: CourseDetailPageProps) => {
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={labels.notFound} />
    }

    return (
        <Box
            identity={{ tier: "page", component: "CourseDetailPage" }}
            principle="center-measure"
            className={`mx-auto w-full max-w-6xl px-6 py-6 pb-24 @app-md:pb-6${className ? ` ${className}` : ""}`}
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
        >
            {/* ONE grid from the top so the sticky purchase card's top lines up with the
                    breadcrumb/header: header = row 1 (cols 1-2), card = col 3 spanning rows 1-2,
                    narrative = row 2 (cols 1-2). Row gap = 10 (header → content, layouts/gap.md),
                    column gap = 6. DOM order hero → card → narrative → mobile stacks
                    header → purchase card → curriculum. */}
            <>
                <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 @app-md:grid-cols-3">
                    {isSkeleton ? (
                        <Box className="@app-md:col-span-2 @app-md:col-start-1 @app-md:row-start-1">
                            <StackV gap={4} principle="content-row"
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                items={[
                                    () => <Skeleton.Typography type="h2" />,
                                    () => <Skeleton.Typography type="body" />,
                                    () => <Skeleton.Metric />,
                                ]} />
                        </Box>
                    ) : (
                        <CourseHero className="@app-md:col-span-2 @app-md:col-start-1 @app-md:row-start-1" />
                    )}
                    {isSkeleton ? (
                        <Skeleton.Card className="@app-md:col-span-1 @app-md:col-start-3 @app-md:row-span-2 @app-md:row-start-1" />
                    ) : (
                        <CoursePricingRail className="@app-md:col-span-1 @app-md:col-start-3 @app-md:row-span-2 @app-md:row-start-1" />
                    )}
                    {isSkeleton ? (
                        <Skeleton.Accordion items={3} className="@app-md:col-span-2 @app-md:col-start-1 @app-md:row-start-2" />
                    ) : (
                        <Box className="@app-md:col-span-2 @app-md:col-start-1 @app-md:row-start-2">
                            <StackV gap={6} principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    CourseValueProps,
                                    CourseCurriculum,
                                    CoursePrerequisites,
                                    CourseFaq,
                                ]} />
                        </Box>
                    )}
                </div>
                {/* mobile-only sticky enroll bar — reads course/price itself, so it only
                        renders once the real spine has loaded (matches the old AsyncContent
                        content branch, which never rendered it during loading either). */}
                {!isSkeleton && <CourseMobileEnrollBar className="@app-md:hidden" />}
            </>
        </Box>
    )
}

export { _CourseDetailPage }
