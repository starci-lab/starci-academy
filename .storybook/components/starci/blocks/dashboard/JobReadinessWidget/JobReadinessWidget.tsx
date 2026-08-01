import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { ChartLineUpIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StatPair } from "@sb-components/composites/stats/StatPair/StatPair"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `JobReadinessWidget`: "My readiness" — the growth-loop
 * self-widget: the viewer's strongest purchased-course track (depth score +
 * band), the course-independent foundation percentile, its capstone/interview/CV
 * pillar bars (each only when attempted), and a single "do the next real thing"
 * CTA.
 *
 * GROUND TRUTH: `src`'s `components/features/dashboard/OverviewTab/
 * JobReadinessWidget/index.tsx`, backed by the real `myJobReadiness` query
 * (`QueryUserJobReadinessData`: `foundation` + one `tracks[]` entry per
 * purchased course, strongest `depthScore` first — this widget only ever
 * renders `tracks[0]`, never blends across tracks, see `.workflows/00-INDEX.md`
 * fairness model referenced in the real component's own file header).
 *
 * COMPOSED, NOT REBUILT: the card face is `SurfaceCard` (labeled variant), the
 * headline is `StatPair` ("A number+label pair, placed somewhere that ALREADY
 * has a surface" — `node scripts/matrix.mjs "A number+label pair, placed
 * somewhere that ALREADY has a surface"`), the band is `EnumChip`, each pillar
 * bar is `ProgressMeter` ("ONE ratio over ONE total").
 *
 * ⭐ ONLY THE STRONGEST TRACK, NEVER AN ARRAY. `src` only ever reads `tracks[0]`
 * — this widget is a single-entity self-summary, not a track picker — so the
 * prop is one `JobReadinessTrack`, not `tracks: Array<…>`. Zero tracks (the
 * viewer owns no course yet) is the block's `isEmpty` branch, not an empty array
 * threaded through.
 *
 * ⭐ THE CTA IS FULLY CALLER-BUILT (§14d.1's routing boundary, same convention
 * `LeaderboardBoard.selfRow.profileHref`/`ChallengeDeliverableList.onSubmit`
 * already use): WHICH pillar is still missing (capstone → interview → CV) is a
 * fairness-model business call `src`'s own file header calls out explicitly —
 * "deliberately never suggests buying another course" — and building the actual
 * route needs `pathConfig()` + the viewer's locale, neither of which is generic
 * dashboard-block knowledge. So `nextAction` arrives pre-decided: a label +
 * an `onPress`, or omitted once every pillar has a score.
 *
 * ⭐ THE FOUNDATION LINE IS BLOCK WORDING (same convention as `LeaderboardBoard`'s
 * "Rank #N"): `codingPercentile` is a typed `0..100` number, the
 * sentence around it is built HERE.
 *
 * ⭐ TWO COMPOSITES HAVE NO `isSkeleton` OF THEIR OWN — `ProgressMeter` (same
 * known gap `ChallengeScoreCard`/`MockInterviewScorecard` document). It falls
 * back to a bare `HeroSkeleton` sized to the track height it would have drawn.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Band describing how close a track's depth score is to "job ready" (mirrors backend `UserJobReadinessBand`). */
export type JobReadinessBand = "needsWork" | "building" | "jobReady"

/** The single "do the next real thing" CTA, fully pre-built by the caller (label + route). */
export interface JobReadinessNextAction {
    /** Already-worded CTA label (e.g. "Finish the capstone project"). */
    label: string
    /** Fired on press — the caller already resolved the target route. */
    onPress: () => void
}

/** The viewer's strongest purchased-course track — never blended with other tracks. */
export interface JobReadinessTrack {
    /** Display title of the course this track belongs to. */
    courseTitle: string
    /** The track's own depth score (0–100), or `null` when not yet computable. */
    depthScore: number | null
    /** Readiness band derived from `depthScore` against fixed thresholds. */
    band: JobReadinessBand
    /** Best capstone score (0–100) for this track, or `null` when not attempted. */
    capstoneScore: number | null
    /** Best mock-interview score (0–100) for this track, or `null` when not attempted. */
    interviewScore: number | null
    /** Best CV review score (0–100) tied to this track's course, or `null` when none scored. */
    cvScore: number | null
    /** The single next-step CTA, or omitted once every pillar already has a score. */
    nextAction?: JobReadinessNextAction
}

/** Props for {@link JobReadinessWidget}. */
export interface JobReadinessWidgetProps {
    /** True while the first load is running — {@link AsyncContent}'s loading branch. */
    isLoading: boolean
    /** True (once loaded) → the viewer owns no purchased-course track yet. */
    isEmpty: boolean
    /** Truthy → the snapshot failed to load. Pass SWR's `error`. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry: () => void
    /** Course-independent, engagement-free percentile (0–100), or `null` when unranked. Ignored while `isEmpty`. */
    codingPercentile?: number | null
    /** The strongest track. Required once loaded and non-empty. */
    track?: JobReadinessTrack
    /** `true` → every atom this block owns switches to its own shimmer (data already loaded). */
    isSkeleton?: boolean
}

/** Band → soft chip presentation. */
const BAND_MAP: Record<JobReadinessBand, EnumChipEntry> = {
    needsWork: { color: "default", label: "Needs work" },
    building: { color: "warning", label: "Improving" },
    jobReady: { color: "success", label: "Ready" },
}

/** One pillar's meter, or its skeleton mirror — omitted entirely (not zero-filled) when the pillar has no score. */
const pillarMeter = (label: string, score: number | null, isSkeleton: boolean) => {
    if (!isSkeleton && score === null) {
        return null
    }
    return isSkeleton ? (
        <StackV
            gap={3}

            body={
                <>
                    <Typography size="xs" color="muted" isSkeleton />
                    <HeroSkeleton className="h-1 w-full rounded-full" />
                </>
            }
        />
    ) : (
        <ProgressMeter
            label={label}
            value={score ?? 0}
            max={100}
            showValue

        />
    )
}

/** Props for the internal {@link Content} tree — reused for both the real render and the loading skeleton. */
interface ContentProps {
    codingPercentile?: number | null
    track: JobReadinessTrack
    isSkeleton: boolean
}

const Content = ({ codingPercentile, track, isSkeleton }: ContentProps) => {
    const trackSummary = (
        <>
            <StackH
                gap={4}
                wrap
                align="center"

                body={
                    <>
                        <StatPair
                            value={isSkeleton ? undefined : String(track.depthScore ?? 0)}
                            label={isSkeleton ? undefined : track.courseTitle}
                            isSkeleton={isSkeleton}

                        />
                        <EnumChip value={track.band} map={BAND_MAP} isSkeleton={isSkeleton} />
                    </>
                }
            />
            {!isSkeleton && codingPercentile != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`Ahead of ${codingPercentile}% of learners on coding`}

                />
            ) : null}
            {pillarMeter("Capstone project", track.capstoneScore, isSkeleton)}
            {pillarMeter("Mock interview", track.interviewScore, isSkeleton)}
            {pillarMeter("CV", track.cvScore, isSkeleton)}
            {isSkeleton ? (
                <Button isSkeleton classNames={["self-start"]} />
            ) : track.nextAction ? (
                <Button
                    variant="primary"
                    classNames={["self-start"]}
                    label={track.nextAction.label}
                    onPress={track.nextAction.onPress}

                />
            ) : null}
        </>
    )
    return <StackV gap={4} body={trackSummary} />
}

/** Fixed-shape placeholder rendered while {@link JobReadinessWidgetProps.isLoading} — no real track exists yet. */
const LOADING_TRACK: JobReadinessTrack = {
    courseTitle: "",
    depthScore: 0,
    band: "needsWork",
    capstoneScore: 0,
    interviewScore: 0,
    cvScore: 0,
}

/**
 * "My readiness" — the self job-readiness widget. See the file header
 * for the full contract.
 *
 * @param props - {@link JobReadinessWidgetProps}
 */
const JobReadinessWidget = ({
    isLoading,
    isEmpty,
    error,
    onRetry,
    codingPercentile,
    track,
    isSkeleton = false,
}: JobReadinessWidgetProps) => (
    <SurfaceCard
        label="My readiness"


        body={() => (
            <AsyncContent
                isLoading={isLoading}
                skeleton={<Content track={LOADING_TRACK} isSkeleton />}
                isEmpty={isEmpty}
                emptyContent={{
                    title: "No readiness signal yet",
                    description: "Buy a course, then complete the capstone project, a mock interview, or a CV review to see your readiness.",
                    icon: ChartLineUpIcon,
                }}
                error={error}
                errorContent={{
                    title: "Couldn't load readiness",
                    description: "Retry to see the latest signal.",
                    onRetry,
                    retryLabel: "Retry",
                }}

            >
                {track ? (
                    <Content
                        codingPercentile={codingPercentile}
                        track={track}
                        isSkeleton={isSkeleton}

                    />
                ) : null}
            </AsyncContent>
        )}
    />
)

export { JobReadinessWidget }
