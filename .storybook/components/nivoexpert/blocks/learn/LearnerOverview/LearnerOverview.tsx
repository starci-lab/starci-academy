import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LearnerOverview` -- the student's dashboard-home header: a greeting, then two
 * headline tiles (enrolled courses, lessons completed), then an optional XP/level
 * strip. The two pictures -- `xp present`, `xp unavailable` -- are DATA, so they are
 * STATES of the single shape. Grounded in the real `myXp` query and the client's
 * own per-course progress count.
 */

/** The two headline tiles -- counted across every enrolled course by the connected layer. */
export interface LearnerOverviewStats {
    /** Courses with at least one lesson touched (any `LessonProgressEntity` row). */
    enrolledCount: number
    /** Lessons with a `completedAt`, summed across every enrolled course. */
    completedLessons: number
}

/** The member's XP + derived level, from the real `myXp` query. */
export interface LearnerXpView {
    /** Total XP earned. */
    xp: number
    /** Level derived from `xp`. */
    level: number
    /** This level's display title (e.g. "Explorer"). */
    title: string
    /** XP needed to reach the next level, or `null` at the max level. */
    nextAt: number | null
}

/** Props for {@link LearnerOverview}. */
export interface LearnerOverviewProps {
    /** The member's display name, for the greeting line. */
    learnerName: string
    /** The two headline tiles. */
    stats: LearnerOverviewStats
    /**
     * The member's XP/level, or `null` when the XP query failed -- the real client
     * swallows that failure silently, so `null` means "no strip", never an error.
     */
    xp: LearnerXpView | null
    /**
     * `true` -> the overview's own first fetch is in flight: the greeting, both
     * tiles, and the XP strip all draw their skeleton mirror, threaded down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LearnerOverviewLabels
}

/** The already-resolved copy the block renders. */
export interface LearnerOverviewLabels {
    /** Greeting prefix, before the learner's name (e.g. "Welcome back"). */
    greetingPrefix: string
    /** Label under the enrolled-courses tile. */
    enrolledLabel: string
    /** Label under the completed-lessons tile. */
    completedLabel: string
    /** Prefix before the level number in the XP strip's chip (e.g. "Level"). */
    levelPrefix: string
    /** Suffix after the XP number (e.g. "XP"). */
    xpSuffix: string
    /** Joined after the XP figure when a next level exists (e.g. "to next level"). */
    nextLevelPrefix: string
    /** Shown instead of the "to next level" line once `nextAt` is `null`. */
    maxLevelLabel: string
}

/**
 * The learner's dashboard-home overview. See the file header for why the XP strip
 * is a state of this one shape rather than a leaf of its own.
 *
 * @param props - {@link LearnerOverviewProps}
 */
const LearnerOverview = ({ learnerName, stats, xp, isSkeleton = false, labels }: LearnerOverviewProps) => {
    /** The two headline tiles, in a reflowing grid. */
    const StatsGrid = () => (
        <Grid
            columns={{ base: 1, sm: 2 }}
            gap={4}
            items={[
                {
                    key: "enrolled",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={String(stats.enrolledCount)} label={labels.enrolledLabel} />
                        ),
                },
                {
                    key: "completed",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={String(stats.completedLessons)} label={labels.completedLabel} />
                        ),
                },
            ]}
        />
    )

    /**
     * `true` -> the strip has something to draw: either the real XP is in hand, or
     * the block is still loading (loading doesn't know yet whether XP will land, so
     * it shows the fuller shape rather than guessing it will be absent).
     */
    const showXpStrip = isSkeleton || xp !== null

    /** The XP/level strip -- a chip + title above a progress-to-next-level meter. */
    const XpStrip = () => {
        const nextAt = xp?.nextAt ?? null
        const xpValue = xp?.xp ?? 0
        const caption =
            nextAt !== null
                ? `${xpValue} ${labels.xpSuffix} · ${nextAt - xpValue} ${labels.nextLevelPrefix}`
                : `${xpValue} ${labels.xpSuffix} · ${labels.maxLevelLabel}`
        return (
            <SurfaceCard
                variant="nested"
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={2}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Chip tone="accent" isSkeleton={isSkeleton} text={`${labels.levelPrefix} ${xp?.level ?? 1}`} />,
                                        () => <Typography size="sm" weight="semibold" isSkeleton={isSkeleton} text={xp?.title ?? ""} />,
                                    ]}
                                />
                            ),
                            () => (
                                <ProgressMeter
                                    value={xpValue}
                                    max={nextAt ?? Math.max(xpValue, 1)}
                                    isSkeleton={isSkeleton}
                                    color="accent"
                                />
                            ),
                            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={caption} />,
                        ]}
                    />
                )}
            />
        )
    }

    return (
        <div data-tier="block" data-component="LearnerOverview">
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => <Typography size="h4" weight="semibold" isSkeleton={isSkeleton} text={`${labels.greetingPrefix}, ${learnerName}`} />,
                    () => <StatsGrid />,
                    ...(showXpStrip ? [() => <XpStrip />] : []),
                ]}
            />
        </div>
    )
}

export { LearnerOverview }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LearnerOverview" } as const
