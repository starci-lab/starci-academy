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
 * BLOCK — `JobReadinessWidget`: "Độ sẵn sàng của tôi" — the growth-loop
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
 * "Hạng #N"): `codingPercentile` is a typed `0..100` number, the Vietnamese
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
    /** Already-worded CTA label (e.g. "Hoàn thành dự án cuối khoá"). */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Band → soft chip presentation. */
const BAND_MAP: Record<JobReadinessBand, EnumChipEntry> = {
    needsWork: { color: "default", label: "Cần cải thiện" },
    building: { color: "warning", label: "Đang tiến bộ" },
    jobReady: { color: "success", label: "Sẵn sàng" },
}

/** One pillar's meter, or its skeleton mirror — omitted entirely (not zero-filled) when the pillar has no score. */
const pillarMeter = (label: string, score: number | null, isSkeleton: boolean, showAnatomy: boolean) => {
    if (!isSkeleton && score === null) {
        return null
    }
    return isSkeleton ? (
        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
            <Typography size="xs" color="muted" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
            <HeroSkeleton className="h-1 w-full rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
        </StackV>
    ) : (
        <ProgressMeter
            label={label}
            value={score ?? 0}
            max={100}
            showValue
            anatPart={showAnatomy ? "ProgressMeter" : undefined}
        />
    )
}

/** Props for the internal {@link Content} tree — reused for both the real render and the loading skeleton. */
interface ContentProps {
    codingPercentile?: number | null
    track: JobReadinessTrack
    isSkeleton: boolean
    showAnatomy: boolean
}

const Content = ({ codingPercentile, track, isSkeleton, showAnatomy }: ContentProps) => (
    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
        <StackH gap="grouped" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
            <StatPair
                value={isSkeleton ? undefined : (track.depthScore ?? 0)}
                label={isSkeleton ? undefined : track.courseTitle}
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "StatPair" : undefined}
            />
            <EnumChip value={track.band} map={BAND_MAP} isSkeleton={isSkeleton} anatPart={showAnatomy ? "EnumChip" : undefined} />
        </StackH>
        {!isSkeleton && codingPercentile != null ? (
            <Typography
                size="xs"
                color="muted"
                text={`Vượt qua ${codingPercentile}% học viên về coding`}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        ) : null}
        {pillarMeter("Dự án cuối khoá", track.capstoneScore, isSkeleton, showAnatomy)}
        {pillarMeter("Phỏng vấn thử", track.interviewScore, isSkeleton, showAnatomy)}
        {pillarMeter("CV", track.cvScore, isSkeleton, showAnatomy)}
        {isSkeleton ? (
            <Button isSkeleton classNames={["self-start"]} />
        ) : track.nextAction ? (
            <Button
                variant="primary"
                classNames={["self-start"]}
                label={track.nextAction.label}
                onPress={track.nextAction.onPress}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        ) : null}
    </StackV>
)

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
 * "Độ sẵn sàng của tôi" — the self job-readiness widget. See the file header
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
    showAnatomy = false,
    anatPart,
}: JobReadinessWidgetProps) => (
    <SurfaceCard
        label="Độ sẵn sàng của tôi"
        anatPart={anatPart}
        showAnatomy={showAnatomy}
    >
        <AsyncContent
            isLoading={isLoading}
            skeleton={<Content track={LOADING_TRACK} isSkeleton showAnatomy={showAnatomy} />}
            isEmpty={isEmpty}
            emptyContent={{
                title: "Chưa có tín hiệu sẵn sàng",
                description: "Mua một khoá học rồi hoàn thành dự án cuối khoá, phỏng vấn thử hoặc chấm CV để xem độ sẵn sàng của bạn.",
                icon: ChartLineUpIcon,
            }}
            error={error}
            errorContent={{
                title: "Không tải được độ sẵn sàng",
                description: "Thử lại để xem tín hiệu mới nhất.",
                onRetry,
                retryLabel: "Thử lại",
            }}
            showAnatomy={showAnatomy}
        >
            {track ? (
                <Content
                    codingPercentile={codingPercentile}
                    track={track}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            ) : null}
        </AsyncContent>
    </SurfaceCard>
)

export { JobReadinessWidget }
