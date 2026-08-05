import React from "react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { StatPair } from "@/components/composites/stats/StatPair"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { UserJobReadinessBand } from "@/modules/api/graphql/queries/types/user-job-readiness"

/** Readiness band -> the `Chip` tone that reads correctly. */
const BAND_CHIP_TONE: Record<UserJobReadinessBand, ChipTone> = {
    needsWork: "default",
    building: "warning",
    jobReady: "success",
}

/** All display text, already localized by the connected `JobReadinessWidget`; a story passes i18n keys. */
export interface JobReadinessWidgetLabels {
    /** Error-branch title. */
    errorTitle: string
    /** Error-branch retry button label. */
    retry: string
    /** Empty-branch title — no purchased-course track has a snapshot yet. */
    emptyTitle: string
    /** Empty-branch supporting line. */
    emptyDescription: string
    /** "Capstone project" pillar-meter label. */
    trackCapstone: string
    /** "Mock interview" pillar-meter label. */
    trackInterview: string
    /** "CV" pillar-meter label. */
    trackCv: string
}

/** Props for {@link _JobReadinessWidget} — presentational; all data resolved, no fetch/store/i18n. */
export interface JobReadinessWidgetProps {
    /** First load, nothing in hand → the whole widget shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no strongest track (no purchased course has a snapshot yet) → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Strongest track's course title (its own depth card, never blended with other tracks). */
    courseTitle?: string
    /** Strongest track's own depth score (0–100). */
    depthScore?: number
    /** Strongest track's readiness band — drives the chip's tone. */
    band?: UserJobReadinessBand
    /** Already-translated band label (e.g. "Building"), paired with {@link band}. */
    bandLabel?: string
    /** Already-translated + interpolated foundation-percentile sentence. `undefined` → the row is skipped (course has no ranked percentile yet). */
    foundationPercentileText?: string
    /** Strongest track's capstone score, or `null` when not attempted (row omitted once settled). */
    capstoneScore?: number | null
    /** Strongest track's mock-interview score, or `null` when not attempted (row omitted once settled). */
    interviewScore?: number | null
    /** Strongest track's CV-review score, or `null` when not attempted (row omitted once settled). */
    cvScore?: number | null
    /** Fired when the single CTA is pressed — jumps to whichever pillar is still missing. */
    onCtaPress?: () => void
    /** Already-translated CTA label, paired with {@link onCtaPress}. `undefined` → every pillar is already attempted, no CTA renders. */
    ctaLabel?: string
    /** Every display string, already resolved by the connected file. */
    labels: JobReadinessWidgetLabels
}

/**
 * Dashboard "My job readiness" self-widget — the presentational half of
 * {@link import("./index").JobReadinessWidget}: the growth-loop nudge for the
 * viewer's OWN job-readiness snapshot — a headline (strongest track's depth +
 * band, plus the global foundation percentile), its capstone/interview/CV
 * pillar bars (each rendered only when attempted), and a single CTA aimed at
 * whichever pillar is still missing (capstone → mock interview → CV).
 *
 * Deliberately never suggests buying another course to raise a score (see
 * `.workflows/00-INDEX.md` fairness model + WF-06 copy discipline) — the CTA
 * only ever points at completing real work on the track the learner already
 * owns. Content only — the parent `LabeledCard` supplies the frame.
 *
 * Three states in the fixed order error → loading → empty → content
 * (BLOCK-8): `error` falls to the shared `AsyncContentError` frame, `isEmpty`
 * to `AsyncContentEmpty`, and otherwise the one tree renders with
 * `isSkeleton` threaded to every leaf so the shimmer mirrors the loaded shape
 * (loading-and-skeleton.md). See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link JobReadinessWidgetProps}
 */
export const _JobReadinessWidget = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    courseTitle,
    depthScore,
    band,
    bandLabel,
    foundationPercentileText,
    capstoneScore = null,
    interviewScore = null,
    cvScore = null,
    onCtaPress,
    ctaLabel,
    labels,
}: JobReadinessWidgetProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8) — the empty and error
    // surfaces are the shared `AsyncContent*` frames, not hand-written JSX (loading-and-skeleton.md §6).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty icon={ChartLineUpIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
    }

    // Each row is a DATA condition — a pillar with no score, or a foundation percentile that was
    // never ranked, is omitted rather than zero-filled — except while shimmering, when every row
    // renders as a placeholder (same row component, same count shape, loading-and-skeleton.md §1).
    const showFoundation = isSkeleton || foundationPercentileText !== undefined
    const showCapstone = isSkeleton || capstoneScore !== null
    const showInterview = isSkeleton || interviewScore !== null
    const showCv = isSkeleton || cvScore !== null
    const showCta = isSkeleton || (onCtaPress !== undefined && ctaLabel !== undefined)

    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            identity={{ tier: "block", component: "JobReadinessWidget" }}
            items={[
                () => (
                    <StackH gap={4} at="sm" items={[
                        () => (isSkeleton
                            ? <StatPair isSkeleton />
                            : <StatPair value={String(depthScore ?? 0)} label={courseTitle ?? ""} />),
                        () => (isSkeleton
                            ? <Chip isSkeleton />
                            : <Chip tone={band ? BAND_CHIP_TONE[band] : "default"} text={bandLabel ?? ""} />),
                    ]} />
                ),
                ...(showFoundation ? [() => (
                    <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={foundationPercentileText} />
                )] : []),
                ...(showCapstone ? [() => (
                    isSkeleton
                        ? <ProgressMeter isSkeleton showValue label={labels.trackCapstone} />
                        : <ProgressMeter value={capstoneScore ?? 0} max={100} showValue label={labels.trackCapstone} />
                )] : []),
                ...(showInterview ? [() => (
                    isSkeleton
                        ? <ProgressMeter isSkeleton showValue label={labels.trackInterview} />
                        : <ProgressMeter value={interviewScore ?? 0} max={100} showValue label={labels.trackInterview} />
                )] : []),
                ...(showCv ? [() => (
                    isSkeleton
                        ? <ProgressMeter isSkeleton showValue label={labels.trackCv} />
                        : <ProgressMeter value={cvScore ?? 0} max={100} showValue label={labels.trackCv} />
                )] : []),
                ...(showCta ? [() => (
                    isSkeleton
                        ? <Button isSkeleton variant="primary" classNames={["self-start"]} />
                        : <Button variant="primary" classNames={["self-start"]} label={ctaLabel ?? ""} suffixIcon={ArrowRightIcon} onPress={onCtaPress} />
                )] : []),
            ]}
        />
    )
}
