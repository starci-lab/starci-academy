import React from "react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { PageHeader } from "@/components/composites/layout/Page"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Grid } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"
import { ContinueCardHero, ContinueCardItem } from "@/components/starci/blocks/learn/ContinueCard"
import type {
    PersonalProjectCurrentTask,
    PersonalProjectDashboardTask,
    PersonalProjectGithubStatus,
    PersonalProjectStats,
    PersonalProjectTaskSubtitleState,
} from "@/components/starci/blocks/learn/PersonalProjectDashboard"
import { TaskBreadcrumb } from "@/components/features/learn/PersonalProject/TaskBreadcrumb"

// Re-exported so the connected `index.tsx` (and any story) can build these values without
// reaching past this file into the blueprint's storybook path directly.
export type {
    PersonalProjectCurrentTask,
    PersonalProjectGithubStatus,
    PersonalProjectStats,
    PersonalProjectTaskSubtitleState,
}

/**
 * One keep-going task tile — the blueprint's own {@link PersonalProjectDashboardTask} shape, plus
 * a resolved press handler the connected file already bound (same convention as
 * `CourseContentsLesson.onPress`). Omitted → the tile falls back to the parent's `onSelectTask`.
 */
export interface PersonalProjectTask extends PersonalProjectDashboardTask {
    onPress?: () => void
}

/** All display text, already localized by the connected {@link PersonalProject}; a story passes i18n keys. */
export interface PersonalProjectLabels {
    emptyTitle: string
    errorTitle: string
    retry: string
    /** Continue-hero subtitle AND the active task tile's subtitle — same wording, same as the real feature. */
    nextTask: string
    /** Shown instead of the continue hero once every task is done. */
    allDone: string
    /** Completion meter's own label. */
    completion: string
    /** Full "N/M tasks · N submissions · avg score" stat line — the connected file interpolates it. */
    statsLine: string
    /** Keep-going card's label prefix — the presentational file appends `· <milestone>`. */
    keepGoing: string
    /** GitHub "not connected" copy — the connected file folds this into `githubStatus.label` before handing it down. */
    notConnected: string
    /** Completed-task tile subtitle. */
    taskDone: string
    /** Locked-task tile subtitle. */
    taskLocked: string
    /** Not-yet-started task tile subtitle. */
    taskTodo: string
}

/** Props for {@link _PersonalProject} — presentational; all data resolved, no fetch/store/i18n. */
export interface PersonalProjectProps {
    /** Async status, owned by the connected file. */
    isLoading?: boolean
    error?: unknown
    onRetry?: () => void
    /** `true` (after loading) → no milestones/tasks configured for this course → the empty state. */
    isEmpty?: boolean
    /** Capstone title — the page heading. */
    title: string
    /** One-line description under the title. */
    description?: string
    /** GitHub connection status shown as a chip in the header's meta row. */
    githubStatus: PersonalProjectGithubStatus
    /** The next task to work on. Omitted once every task is completed. */
    currentTask?: PersonalProjectCurrentTask
    /** Fired when the learner presses the continue hero's CTA. */
    onContinue: () => void
    /** Aggregate KPIs — see {@link PersonalProjectStats}. */
    stats: PersonalProjectStats
    /** The current milestone's name — the "keep going" card prefixes `labels.keepGoing ·` onto it. */
    milestoneLabel?: string
    /** The current milestone's tasks, in display order. */
    tasks: Array<PersonalProjectTask>
    /** Fired with a task's id when its tile is pressed and that row carries no own `onPress`. */
    onSelectTask?: (taskId: string) => void
    labels: PersonalProjectLabels
}

/** Breadcrumb slot for the header — a connected child that self-fetches its crumbs (split.md). */
const BreadcrumbSlot: ComponentTypeWithSkeleton = () => <TaskBreadcrumb />

/**
 * Placeholder tiles for the keep-going grid while loading. ONE tree — the resting state is the
 * SAME `Grid` shimmered, never a hand-mirrored copy that drifts.
 */
const SKELETON_TASKS: Array<PersonalProjectTask> = Array.from({ length: 4 }, (_unused, index) => ({
    id: `skeleton-task-${index}`,
    sortIndex: index + 1,
    title: "",
    subtitleState: "todo",
}))

/** `subtitleState` → the localized subtitle line for one keep-going task tile. */
const taskSubtitle = (state: PersonalProjectTaskSubtitleState, labels: PersonalProjectLabels): string => {
    switch (state) {
    case "active":
        return labels.nextTask
    case "done":
        return labels.taskDone
    case "locked":
        return labels.taskLocked
    case "todo":
        return labels.taskTodo
    }
}

/**
 * Personal-project home — the presentational half of {@link PersonalProject}, composed on the
 * tier-correct storybook vocabulary (`PageHeader` / `ContinueCardHero` / `ProgressMeter` /
 * `SurfaceCard` / `Grid` / `ContinueCardItem`) and mirroring `PersonalProjectDashboard` (the
 * blueprint), the structural analog of `CourseContents` for the capstone. Layout: breadcrumb →
 * header (title + description + a GitHub-status chip) → continue hero (the next task, or an
 * all-done line) over one honest completion meter + the stats line → keep-going grid (the current
 * milestone's tasks as tiles). The header sits OUTSIDE the async boundary — its title/description
 * and GitHub chip come off data the connected file already has (the enrollment record), so they
 * never wait on the milestone/progress fetch; only the body below does, and it shimmers the SAME
 * spine (`spine(isSkeleton)`) rather than a hand-mirrored copy. The self-fetching `TaskBreadcrumb`
 * child is rendered as-is (a presentational screen may render connected children, split.md). The
 * connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link PersonalProjectProps}
 */
export const _PersonalProject = ({
    isLoading = false,
    error,
    onRetry,
    isEmpty = false,
    title,
    description,
    githubStatus,
    currentTask,
    onContinue,
    stats,
    milestoneLabel,
    tasks,
    onSelectTask,
    labels,
}: PersonalProjectProps) => {
    const keepGoingLabel = milestoneLabel ? `${labels.keepGoing} · ${milestoneLabel}` : labels.keepGoing

    // Header meta chip — GitHub connection status. Its data comes off the enrollment record, not
    // the milestone/progress fetch below, so it renders for real regardless of `isLoading`.
    const MetaChip: ComponentTypeWithSkeleton = () => (
        <Chip
            tone={githubStatus.isConnected ? "success" : "default"}
            icon={GithubLogoIcon}
            text={githubStatus.label}
        />
    )

    // ONE tree for the milestone-dependent body — the resting state is this SAME spine with
    // `isSkeleton` threaded into every shimmer-capable part, never a hand-mirrored copy.
    // `spine(true)` is the loading branch, `spine(false)` the content branch; they cannot drift
    // because they are the same code.
    const spine = (isSkeleton: boolean) => {
        const rows = isSkeleton ? SKELETON_TASKS : tasks
        return (
            <StackV
                gap={6}
                isSkeleton={isSkeleton}
                items={[
                    // Continue hero (or the all-done line) + completion meter + stats line.
                    () => (
                        <StackV
                            gap={4}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (isSkeleton || currentTask ? (
                                    <ContinueCardHero
                                        title={currentTask ? `${currentTask.sortIndex}. ${currentTask.title}` : ""}
                                        subtitle={labels.nextTask}
                                        isSkeleton={isSkeleton}
                                        onPress={onContinue}
                                    />
                                ) : (
                                    <Typography weight="semibold" text={labels.allDone} />
                                )),
                                () => (
                                    <ProgressMeter
                                        value={stats.done}
                                        max={stats.total || 1}
                                        label={labels.completion}
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
                                        text={labels.statsLine}
                                    />
                                ),
                            ]}
                        />
                    ),
                    // Keep-going grid — the current milestone's tasks (the full milestone list
                    // lives in the left rail, so the body only surfaces "where you are + what's next").
                    () => (
                        <SurfaceCard
                            label={keepGoingLabel}
                            isSkeleton={isSkeleton}
                            body={() => (
                                <Grid
                                    columns={{ base: 1, sm: 2 }}
                                    gap={4}
                                    items={rows.map((task) => ({
                                        key: task.id,
                                        content: () => (
                                            <ContinueCardItem
                                                title={`${task.sortIndex}. ${task.title}`}
                                                subtitle={taskSubtitle(task.subtitleState, labels)}
                                                isSkeleton={isSkeleton}
                                                onPress={() => {
                                                    if (task.onPress) {
                                                        task.onPress()
                                                        return
                                                    }
                                                    onSelectTask?.(task.id)
                                                }}
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

    return (
        <div data-tier="page" data-component="PersonalProject">
            <StackV
                gap={6}
                items={[
                    () => (
                        <PageHeader
                            breadcrumb={BreadcrumbSlot}
                            title={title}
                            description={description}
                            meta={MetaChip}
                        />
                    ),
                    () => (
                        <AsyncContent
                            isLoading={isLoading}
                            skeleton={() => spine(true)}
                            isEmpty={isEmpty}
                            emptyContent={{ title: labels.emptyTitle }}
                            error={error}
                            errorContent={{
                                title: labels.errorTitle,
                                onRetry: () => { onRetry?.() },
                                retryLabel: labels.retry,
                            }}
                            content={() => spine(false)}
                        />
                    ),
                ]}
            />
        </div>
    )
}
