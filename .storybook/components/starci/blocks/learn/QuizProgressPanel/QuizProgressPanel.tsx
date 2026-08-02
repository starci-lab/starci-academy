import React from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import type { ComponentType, SVGProps } from "react"
import { ChartBarIcon, ChartLineIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StatGridCard, type StatGridCardItem } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `QuizProgressPanel` — how has this learner been drilling: lifetime numbers and the
 * sessions behind them. Sits beside `QuizSetup` in the setup pane. `Empty` is its
 * own shape — with zero sessions both views would be empty, so the whole panel
 * collapses to one invitation rather than letting the learner flip between two empty
 * views. The `stats` ⇄ `history` view switch is a state inside `Content` (swapping
 * `StatGridCard` vs `SurfaceCardList`) since both read the same already-loaded data.
 */

/** Which half of the panel is showing. */
export type QuizProgressView = "stats" | "history"

/** Icon passed as a COMPONENT reference (§4/§5) — the block renders it at its own fixed scale. */
type StatIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Label + icon per view. The BLOCK owns this table — same reasoning as
 * `FlashcardModeSwitch`/`ContentModeNav`: it is the vocabulary of THIS switch,
 * and a caller that could pass it would own wording that belongs here.
 */
const VIEW_LABEL: Record<QuizProgressView, string> = {
    stats: "Stats",
    history: "History",
}

const VIEW_ICON: Record<QuizProgressView, StatIcon> = {
    stats: ChartBarIcon,
    history: ClockCounterClockwiseIcon,
}

/** One lifetime number — already reduced/formatted by the caller (a count, a percentage, a streak). */
export interface QuizProgressStat {
    /** Stable React key. */
    key: string
    /** Optional leading glyph, a COMPONENT reference — the block owns its size/tone. */
    icon?: StatIcon
    /** What the number is, e.g. "Accuracy". */
    label: string
    /** The number itself, already formatted by the caller, e.g. "82%", "7 days". */
    value: string
}

/** One past drill in the history view. */
export interface QuizProgressSession {
    /** Stable React key. */
    key: string
    /** What the run was called when it was started. */
    name: string
    /** Already-formatted relative/absolute date from the caller, e.g. "2 days ago". */
    dateLabel: string
    /** Already-formatted result from the caller, e.g. "8/10 correct". */
    scoreLabel: string
    /** Fired when the learner opens this run. Omit for a run that can't be reopened. */
    onPress?: () => void
}

/** Props for {@link QuizProgressPanel}. */
export interface QuizProgressPanelProps {
    /** Section label above the card, localized by the caller — e.g. "How you've been practicing". */
    label: string
    /** Which view is showing now. */
    view: QuizProgressView
    /** Fired with the view the learner picked. */
    onViewChange: (view: QuizProgressView) => void
    /** Accessible name for the view switch, localized by the caller (blocks carry no i18n). */
    viewAriaLabel: string
    /** Lifetime numbers for the stats view. */
    stats: Array<QuizProgressStat>
    /** Past runs for the history view, most recent first. EMPTY (and not loading) → the whole panel becomes one invitation. */
    sessions: Array<QuizProgressSession>
    /** `true` → the card draws its own mirror while progress data loads. */
    isSkeleton?: boolean
}

/** Fixed shape for the loading mirror — a stable 4-cell grid, known ahead of any real data (same reasoning as `ContentDiscussion`'s `SKELETON_ROWS`). */
const SKELETON_STATS: Array<QuizProgressStat> = [
    { key: "s1", label: "", value: "" },
    { key: "s2", label: "", value: "" },
    { key: "s3", label: "", value: "" },
    { key: "s4", label: "", value: "" },
]

/** Fixed shape for the loading mirror — three placeholder rows, same reasoning as {@link SKELETON_STATS}. */
const SKELETON_SESSIONS: Array<QuizProgressSession> = [
    { key: "s1", name: "", dateLabel: "", scoreLabel: "" },
    { key: "s2", name: "", dateLabel: "", scoreLabel: "" },
    { key: "s3", name: "", dateLabel: "", scoreLabel: "" },
]

/** Builds one {@link StatGridCardItem}'s free-form content — icon + label over the value, shimmering together via `isSkeleton`. */
const statCell = (stat: QuizProgressStat, isSkeleton: boolean): StatGridCardItem => {
    const Icon = stat.icon
    return {
        key: stat.key,
        content: () => (
            <StackV
                gap={2}
                isSkeleton={isSkeleton}
                items={[
                    ({ isSkeleton }: SkeletonProps) => (
                        <StackH
                            gap={2}
                            align="center"
                            isSkeleton={isSkeleton}
                            items={[
                                ...(Icon ? [() => <Icon aria-hidden focusable="false" className="size-4 text-muted" />] : []),
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={stat.label} />,
                            ]}
                        />
                    ),
                    () => <Typography size="lg" weight="semibold" isSkeleton={isSkeleton} text={stat.value} />,
                ]}
            />
        ),
    }
}

/**
 * The practice-progress panel. See the file header for the full contract.
 *
 * @param props - {@link QuizProgressPanelProps}
 */
const QuizProgressPanel = ({
    label,
    view,
    onViewChange,
    viewAriaLabel,
    stats,
    sessions,
    isSkeleton = false,
}: QuizProgressPanelProps) => {
    const tabItems: Array<TabItem> = (Object.keys(VIEW_LABEL) as Array<QuizProgressView>).map((key) => ({
        key,
        label: VIEW_LABEL[key],
        icon: VIEW_ICON[key],
    }))

    // No run has ever happened — see the file header's judgment call.
    const isEmpty = !isSkeleton && sessions.length === 0

    const statItems = (isSkeleton ? SKELETON_STATS : stats).map((stat) => statCell(stat, isSkeleton))

    const historyItems: Array<SurfaceCardListItem> = (isSkeleton ? SKELETON_SESSIONS : sessions).map((session) => ({
        key: session.key,
        title: session.name,
        subtitle: session.dateLabel,
        metaText: session.scoreLabel,
        onPress: isSkeleton ? undefined : session.onPress,
    }))

    const panelBody = (
        <>
            <div>
                <Tabs
                    items={tabItems}
                    selectedKey={view}
                    onSelectionChange={(key) => onViewChange(key as QuizProgressView)}
                    ariaLabel={viewAriaLabel}
                    isSkeleton={isSkeleton}

                />
            </div>
            {view === "stats" ? (
                <div>
                    <StatGridCard items={statItems} />
                </div>
            ) : (
                <SurfaceCardList
                    items={historyItems}
                    isSkeleton={isSkeleton}


                />
            )}
        </>
    )

    return (
        <div>
            <SurfaceCard
                label={label}

                body={() =>
                    isEmpty ? (
                        <EmptyState
                            icon={ChartLineIcon}
                            title="No practice sessions yet"
                            description="Start a session in the panel beside this one — your first run will show its stats and history here."

                        />
                    ) : (
                        <StackV gap={6} isSkeleton={isSkeleton} items={[() => panelBody]} />
                    )
                }
            />
        </div>
    )
}

export { QuizProgressPanel }
