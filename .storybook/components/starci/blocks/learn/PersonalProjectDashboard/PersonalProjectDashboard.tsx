import React from "react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { Breadcrumbs, type BreadcrumbItem } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { AsyncContent, type AsyncContentEmptyProps } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ContinueCardHero, ContinueCardItem } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"

/**
 * `PersonalProjectDashboard` — the capstone landing overview ("where am I + what's
 * next"), shown when the personal-project route carries no `taskId`: breadcrumb →
 * title/description/GitHub-status header, over a continue hero + completion meter,
 * over the current milestone's tasks as a two-column grid.
 *
 * Shapes:
 *   • `Full` — a next task exists, so the continue hero renders; GitHub connected
 *     vs not are states inside it.
 *   • `AllDone` — no `currentTask`, so the hero is gone, replaced by an "all done" line.
 *   • `Loading` — `AsyncContent` falls to the shimmer mirror.
 *   • `Empty` — `AsyncContent` falls to the empty message; the header is unaffected.
 */

/** One breadcrumb link above the dashboard title — plain data, the block builds the atom. */
export interface PersonalProjectDashboardCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** GitHub connection status fed into the header's status chip. */
export interface PersonalProjectGithubStatus {
    /** `true` → the chip renders in its connected (success) tone. */
    isConnected: boolean
    /**
     * Already-formatted display text — `"owner/repo · branch"` when connected, or
     * the "not connected" copy otherwise. Parsing the raw GitHub URL is the
     * caller's job (business logic, not presentation); the block only reacts to
     * `isConnected` for the chip's tone/icon.
     */
    label: string
}

/** The task currently in progress, fed into the continue hero. */
export interface PersonalProjectCurrentTask {
    /** 1-based position inside its milestone — the block prefixes it onto the title. */
    sortIndex: number
    /** Task title, WITHOUT the index prefix. */
    title: string
}

/** Where one keep-going task stands — the block owns the subtitle wording per state. */
export type PersonalProjectTaskSubtitleState = "active" | "done" | "locked" | "todo"

/** One task row in the keep-going grid — plain data, the block builds the tile. */
export interface PersonalProjectDashboardTask {
    /** Stable React key + the id handed back to `onSelectTask`. */
    id: string
    /** 1-based position inside the milestone — the block prefixes it onto the title. */
    sortIndex: number
    /** Task title, WITHOUT the index prefix. */
    title: string
    /** Which subtitle line this row shows — see {@link PersonalProjectTaskSubtitleState}. */
    subtitleState: PersonalProjectTaskSubtitleState
}

/** Aggregate KPIs across the whole capstone, shown under the completion meter. */
export interface PersonalProjectStats {
    /** Tasks completed so far. */
    done: number
    /** Tasks in the whole project. */
    total: number
    /** Total submit attempts across every task. */
    attempts: number
    /**
     * Already-formatted average score, e.g. `"18/20"` or `"—"` with no scored
     * attempts yet — computing the fraction is arithmetic the caller already
     * has to do to pick the "—" fallback, so it stays one string, same as
     * `ContentLanguage.label`.
     */
    avgLabel: string
}

/** Props for {@link PersonalProjectDashboard}. */
export interface PersonalProjectDashboardProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. */
    breadcrumbItems?: Array<PersonalProjectDashboardCrumb>
    /** Dashboard title, e.g. "Personal Project". */
    title: string
    /** One-line description under the title. */
    description?: string
    /** GitHub connection status shown as a chip in the header's meta row. */
    githubStatus: PersonalProjectGithubStatus
    /** The next task to work on. Omit once every task is completed. */
    currentTask?: PersonalProjectCurrentTask
    /** Fired when the learner presses the continue hero's CTA. */
    onContinue: () => void
    /** The current milestone's name — the block prefixes "Continue ·" onto it. */
    milestoneLabel?: string
    /** The current milestone's tasks, in display order. */
    tasks: Array<PersonalProjectDashboardTask>
    /** Fired with a task's id when its tile is pressed. */
    onSelectTask: (taskId: string) => void
    /** Aggregate KPIs — see {@link PersonalProjectStats}. */
    stats: PersonalProjectStats
    /**
     * `true` while the milestone/progress fetch is running (no cache yet) — the
     * continue hero + progress stats + keep-going grid fall to their shimmer
     * mirror. The header (trail/title/description) is unaffected: it never
     * waits on this fetch.
     */
    isLoading?: boolean
    /**
     * `true` → the course has no milestones/tasks configured at all. Only takes
     * effect once `isLoading` is false.
     */
    isEmpty?: boolean
    /**
     * `true` → the header's own dynamic part (the GitHub chip) mirrors instead
     * of waiting on data — independent of `isLoading`, since that chip's data
     * comes off the enrollment record, not the milestone fetch.
     */
    isSkeleton?: boolean
}

/** Block-owned constant — the one classifying fact of the continue hero's subtitle. */
const NEXT_TASK_SUBTITLE = "Next task"

/** Block-owned constant — shown instead of the hero once every task is done. */
const ALL_DONE_TEXT = "You've completed every task in your personal project"

/** Block-owned constant — the completion meter's own label. */
const PROGRESS_LABEL = "Completion progress"

/** Block-owned constant — the keep-going grid's heading prefix. */
const KEEP_GOING_PREFIX = "Continue"

/** Block-owned wording per {@link PersonalProjectTaskSubtitleState} — the caller only sends the enum. */
const TASK_SUBTITLE: Record<PersonalProjectTaskSubtitleState, string> = {
    active: "Next task",
    done: "Completed",
    locked: "Locked",
    todo: "Not started",
}

/** Block-owned empty-state copy — the course has no capstone tasks configured yet. */
const EMPTY_STATE: AsyncContentEmptyProps = {
    title: "No tasks yet",
    description: "This course's personal project has no milestones/tasks set up yet.",
}

/** Placeholder shape guessed while loading (§12c) — mirrors `src`'s 4-row skeleton. */
const SKELETON_TASKS: Array<PersonalProjectDashboardTask> = Array.from({ length: 4 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    sortIndex: index + 1,
    title: "",
    subtitleState: "todo",
}))

/** Assembles the milestone-name prefix the same way `KeepGoingPath` assembles its own heading. */
const keepGoingLabel = (milestoneLabel: string | undefined) =>
    milestoneLabel ? `${KEEP_GOING_PREFIX} · ${milestoneLabel}` : KEEP_GOING_PREFIX

/** Assembles the block-owned stats sentence under the completion meter. */
const statsLine = (stats: PersonalProjectStats) =>
    `${stats.done}/${stats.total} tasks completed · ${stats.attempts} submissions · average score ${stats.avgLabel}`

/** Props for the internal {@link Body} — the two async leaves, real or their shimmer guess. */
interface BodyProps {
    currentTask?: PersonalProjectCurrentTask
    onContinue: () => void
    milestoneLabel?: string
    tasks: Array<PersonalProjectDashboardTask>
    onSelectTask: (taskId: string) => void
    stats: PersonalProjectStats
    isSkeleton: boolean
}

/**
 * `ContinueHero+ProgressStats` and `KeepGoingGrid` — built ONCE and reused for
 * both the real content branch and the loading mirror (guessed data + forced
 * `isSkeleton`), so the two never drift into two hand-kept shapes.
 */
const Body = ({
    currentTask,
    onContinue,
    milestoneLabel,
    tasks,
    onSelectTask,
    stats,
    isSkeleton,
}: BodyProps) => {
    const heroSection = (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}

            items={[
                () => (isSkeleton || currentTask ? (
                    <ContinueCardHero
                        title={currentTask ? `${currentTask.sortIndex}. ${currentTask.title}` : ""}
                        subtitle={NEXT_TASK_SUBTITLE}
                        isSkeleton={isSkeleton}
                        onPress={onContinue}


                    />
                ) : (
                    <Typography weight="semibold" text={ALL_DONE_TEXT} />
                )),
                () => (
                    <ProgressMeter
                        value={stats.done}
                        max={stats.total || 1}
                        label={PROGRESS_LABEL}
                        showValue
                        isSkeleton={isSkeleton}

                    />
                ),
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-3/4"] : undefined}
                        text={statsLine(stats)}

                    />
                ),
            ]}
        />
    )

    return (
        <StackV
            gap={6}
            pattern="block-boundary"
            isSkeleton={isSkeleton}

            items={[
                () => heroSection,
                () => (
                    <SurfaceCard
                        label={keepGoingLabel(milestoneLabel)}
                        isSkeleton={isSkeleton}


                        body={() => (
                            <Grid
                                columns={{ base: 1, sm: 2 }}
                                gap={4}
                                pattern="sibling-stack"

                                items={tasks.map((task) => ({
                                    key: task.id,
                                    content: () => (
                                        <ContinueCardItem
                                            title={`${task.sortIndex}. ${task.title}`}
                                            subtitle={TASK_SUBTITLE[task.subtitleState]}
                                            isSkeleton={isSkeleton}
                                            onPress={() => onSelectTask(task.id)}


                                        />
                                    ),
                                }))}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}

/**
 * The capstone landing overview. See the file header for the full contract.
 *
 * @param props - {@link PersonalProjectDashboardProps}
 */
const PersonalProjectDashboard = ({
    breadcrumbItems,
    title,
    description,
    githubStatus,
    currentTask,
    onContinue,
    milestoneLabel,
    tasks,
    onSelectTask,
    stats,
    isLoading = false,
    isEmpty = false,
    isSkeleton = false,
}: PersonalProjectDashboardProps) => {
    const crumbs: Array<BreadcrumbItem> = (breadcrumbItems ?? []).map((crumb) => ({
        key: crumb.key,
        label: crumb.label,
        onPress: crumb.onPress,
    }))

    const header = (
        <PageHeader

            isSkeleton={isSkeleton}
            breadcrumb={() =>
                isSkeleton || crumbs.length ? (
                    <div className="w-fit">
                        <Breadcrumbs collapseOnMobile items={crumbs} isSkeleton={isSkeleton} />
                    </div>
                ) : undefined
            }
            title={title}
            description={description}
            meta={() =>
                isSkeleton ? (
                    <Chip isSkeleton />
                ) : (
                    <Chip
                        tone={githubStatus.isConnected ? "success" : "default"}
                        icon={GithubLogoIcon}
                        text={githubStatus.label}
                    />
                )
            }
        />
    )

    const asyncBody = (
        <AsyncContent
            isLoading={isLoading}
            skeleton={() => (
                <Body
                    currentTask={{ sortIndex: 1, title: "" }}
                    onContinue={onContinue}
                    milestoneLabel={milestoneLabel}
                    tasks={SKELETON_TASKS}
                    onSelectTask={onSelectTask}
                    stats={{ done: 0, total: 0, attempts: 0, avgLabel: "" }}
                    isSkeleton

                />
            )}
            isEmpty={isEmpty}
            emptyContent={EMPTY_STATE}
            content={() => (
                <Body
                    currentTask={currentTask}
                    onContinue={onContinue}
                    milestoneLabel={milestoneLabel}
                    tasks={tasks}
                    onSelectTask={onSelectTask}
                    stats={stats}
                    isSkeleton={false}

                />
            )}
        />
    )

    return (
        <div>
            <StackV
                gap={6}
                isSkeleton={isSkeleton}

                items={[
                    () => header,
                    () => asyncBody,
                ]}
            />
        </div>
    )
}

export { PersonalProjectDashboard }
