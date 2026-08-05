import React from "react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ContributionCalendarView } from "@/components/features/profile/ContributionCalendarView"
import { StackV } from "@/components/frames/Stack"
import type { CallerIdentity } from "@/components/frames/_identity"
import type { QueryMyContributionDayData } from "@/modules/api/graphql/queries/types/my-dashboard"

/** This block's own identity (BLOCK-2/split.md) — handed down to the track standing in as its root. See `_identity.ts`. */
const IDENTITY: CallerIdentity = { tier: "block", component: "OverviewContributions" }

/** All display text, already localized by the connected `OverviewContributions`; a story passes i18n keys. */
export interface OverviewContributionsLabels {
    errorTitle: string
    retry: string
}

/** Props for {@link _OverviewContributions} — presentational; all data resolved, no fetch/store/i18n. */
export interface OverviewContributionsProps {
    /** First load, nothing in hand → the header/grid/legend shimmer in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Truthy → the error message (beats loading). The connected file only passes its settled fetch error (no cached days left to show). */
    error?: unknown
    /** Retry handler — paired with `labels.retry`. */
    onRetry?: () => void
    /** Active contribution days for the selected year (oldest first); ignored while `isSkeleton`. */
    days?: Array<QueryMyContributionDayData>
    /** The year currently shown. */
    year: number
    /** Called with the picked year when the user flips the year switcher. */
    onYearChange: (year: number) => void
    labels: OverviewContributionsLabels
}

/**
 * Dashboard contribution heatmap (GitHub-style) for the signed-in viewer — the presentational half
 * of {@link import("./index").OverviewContributions}. Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it). Two states in the fixed order
 * error → content (BLOCK-8; there is no genuine empty state — a zero-activity year still renders a
 * real, mostly-blank calendar, so `days.length === 0` is not "nothing to show"): `error` falls to
 * the shared `AsyncContentError` frame.
 *
 * {@link ContributionCalendarView} carries no `isSkeleton` prop of its own (`missingSkeletonSupport`
 * — it is a sibling component, not owned by this split), so while shimmering this swaps in a
 * minimal `Skeleton.*` mirror of its header (count line + year switcher) / grid / legend right here,
 * still co-located with the real tree instead of a separate skeleton file (`loading-and-skeleton.md`).
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link OverviewContributionsProps}
 */
export const _OverviewContributions = ({
    isSkeleton = false,
    error,
    onRetry,
    days = [],
    year,
    onYearChange,
    labels,
}: OverviewContributionsProps) => {
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }

    // The calendar owns its own resting state, so this block hands the flag down instead
    // of keeping a second description of the same shape (`loading-and-skeleton.md`).
    return (
        <StackV
            gap={4}
            identity={IDENTITY}
            body={() => (
                <ContributionCalendarView
                    isSkeleton={isSkeleton}
                    days={days}
                    year={year}
                    onYearChange={onYearChange}
                />
            )}
        />
    )
}
