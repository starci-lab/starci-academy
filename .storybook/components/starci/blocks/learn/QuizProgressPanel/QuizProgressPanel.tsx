import React from "react"
import type { ComponentType, SVGProps } from "react"
import { ChartBarIcon, ChartLineIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { StatGridCard, type StatGridCardItem } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuizProgressPanel`: how has this learner actually been drilling —
 * lifetime numbers, and the sessions behind them. Sits BESIDE `QuizSetup` in the
 * setup pane (already enrolled): setup starts the next run, this panel looks
 * back at every run before it.
 *
 * WHY A BLOCK ON TOP OF THREE COMPOSITES: none of `Tabs` / `SurfaceCardList` /
 * `StatGridCard` knows a "practice session" exists. This block is the one place
 * that turns a `QuizProgressStat` / `QuizProgressSession` into the two views a
 * learner actually asks for — "how am I doing" vs. "what did I run" — and owns
 * the words on the switch between them (§14d.1: the caller hands over `view` and
 * data, never a label).
 *
 * ⛔ REUSE, NOT REBUILD (file exists BECAUSE a sibling block once reached past
 * `Toolbar` and rebuilt a worse tab row from a bare atom — see
 * `ContentModeNav`'s header). This block does not draw its own tab strip, grid,
 * or list frame: `Tabs` is the SAME atom `FlashcardModeSwitch`/`ContentModeNav`
 * already use for a two-way switch, `StatGridCard` is the SAME composite the
 * profile "weekly goals" tile uses for a stat grid, `SurfaceCardList` is the
 * SAME composite every other row-list block in this catalog uses. Nothing new is
 * drawn — three existing pieces are wired to quiz-progress data.
 *
 * ⭐ JUDGMENT CALL — EMPTY IS ITS OWN LEAF, not a state hidden inside
 * `SurfaceCardList`'s own `emptyState` slot. `SurfaceCardList` already supports
 * an inner empty message, and that would have been enough if only the HISTORY
 * view could ever be empty. But with zero sessions ever run, the STATS view
 * would be empty too (every number reads 0) — switching between two empty views
 * is noise, not information. So when there is no history at all, the whole
 * panel (tab switch, grid, list — all three) is replaced by ONE invitation.
 * That is a genuine STRUCTURAL loss (three composed nodes gone, one new node in
 * their place), which is why it is a LEAF (§14d.2) rather than a state of the
 * content leaf, the same call `ContentHeader` made for `NoOutcomes`.
 *
 * ⭐ THE TWO VIEWS SHARE ONE `SurfaceCard` FACE. A learner flips between "stats"
 * and "history" far more often than the panel as a whole appears/disappears, so
 * the card face and its `label` stay put across the switch — only the content
 * beneath the tab row changes. Two separate cards, one per view, would make the
 * switch read as a navigation away from the panel instead of a filter on it.
 *
 * NEVER SWALLOWS A ROW PRESS. `sessions[].onPress` is forwarded straight through
 * `SurfaceCardList` — whether a past session is even worth opening (e.g. a
 * finished vs. an abandoned run) is the CALLER's call, not this block's (§7).
 * ─────────────────────────────────────────────────────────────────────────────
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
    stats: "Thống kê",
    history: "Lịch sử",
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
    /** What the number is, e.g. "Độ chính xác". */
    label: string
    /** The number itself, already formatted by the caller, e.g. "82%", "7 ngày". */
    value: string
}

/** One past drill in the history view. */
export interface QuizProgressSession {
    /** Stable React key. */
    key: string
    /** What the run was called when it was started. */
    name: string
    /** Already-formatted relative/absolute date from the caller, e.g. "2 ngày trước". */
    dateLabel: string
    /** Already-formatted result from the caller, e.g. "8/10 đúng". */
    scoreLabel: string
    /** Fired when the learner opens this run. Omit for a run that can't be reopened. */
    onPress?: () => void
}

/** Props for {@link QuizProgressPanel}. */
export interface QuizProgressPanelProps {
    /** Section label above the card, localized by the caller — e.g. "Đã luyện thế nào". */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
const statCell = (stat: QuizProgressStat, isSkeleton: boolean, showAnatomy: boolean): StatGridCardItem => {
    const Icon = stat.icon
    return {
        key: stat.key,
        content: (
            <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackH gap="tight" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    {Icon ? <Icon aria-hidden focusable="false" className="size-4 text-muted" /> : null}
                    <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={stat.label} anatPart={showAnatomy ? "Typography" : undefined} />
                </StackH>
                <Typography size="lg" weight="semibold" isSkeleton={isSkeleton} text={stat.value} anatPart={showAnatomy ? "Typography" : undefined} />
            </StackV>
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
    showAnatomy = false,
    anatPart,
}: QuizProgressPanelProps) => {
    const tabItems: Array<TabItem> = (Object.keys(VIEW_LABEL) as Array<QuizProgressView>).map((key) => ({
        key,
        label: VIEW_LABEL[key],
        icon: VIEW_ICON[key],
    }))

    // No run has ever happened — see the file header's judgment call.
    const isEmpty = !isSkeleton && sessions.length === 0

    const statItems = (isSkeleton ? SKELETON_STATS : stats).map((stat) => statCell(stat, isSkeleton, showAnatomy))

    const historyItems: Array<SurfaceCardListItem> = (isSkeleton ? SKELETON_SESSIONS : sessions).map((session) => ({
        key: session.key,
        title: session.name,
        subtitle: session.dateLabel,
        metaText: session.scoreLabel,
        onPress: isSkeleton ? undefined : session.onPress,
    }))

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard label={label} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                {isEmpty ? (
                    <FeedbackEmpty
                        icon={ChartLineIcon}
                        title="Chưa có phiên luyện nào"
                        description="Dựng một phiên ở khung bên cạnh — phiên đầu tiên sẽ hiện thống kê và lịch sử ở đây."
                        anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                    />
                ) : (
                    <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                        {/* `Tabs` carries no `anatPart` of its own (§ pattern, same as `Toolbar` in
                            `ContentModeNav`) — the wrapping div is the badge anchor. */}
                        <div data-anat-part={showAnatomy ? "Tabs" : undefined}>
                            <Tabs
                                items={tabItems}
                                selectedKey={view}
                                onSelectionChange={(key) => onViewChange(key as QuizProgressView)}
                                ariaLabel={viewAriaLabel}
                                isSkeleton={isSkeleton}
                                showAnatomy={showAnatomy}
                            />
                        </div>
                        {view === "stats" ? (
                            // `StatGridCard` carries no `anatPart` of its own either — same wrap.
                            <div data-anat-part={showAnatomy ? "StatGridCard" : undefined}>
                                <StatGridCard items={statItems} showAnatomy={showAnatomy} />
                            </div>
                        ) : (
                            <SurfaceCardList
                                items={historyItems}
                                isSkeleton={isSkeleton}
                                anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        )}
                    </StackV>
                )}
            </SurfaceCard>
        </div>
    )
}

export { QuizProgressPanel }
