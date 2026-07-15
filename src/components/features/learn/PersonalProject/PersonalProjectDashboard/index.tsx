"use client"

import React, { useCallback, useMemo } from "react"
import { Chip, Typography, cn } from "@heroui/react"
import {
    CheckCircleIcon,
    CircleIcon,
    GithubLogoIcon,
    LockIcon,
    PlayIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils/task-lookup"
import { PersonalProjectDashboardSkeleton } from "./PersonalProjectDashboardSkeleton"
import { TaskBreadcrumb } from "../TaskBreadcrumb"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedTaskId } from "@/redux/slices/milestone"
import { useQueryMilestonesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestonesSwr"
import { useQueryMilestoneTaskProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestoneTaskProgressSwr"
import { pathConfig } from "@/resources/path"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import type { MilestoneEntity } from "@/modules/types/entities/milestone"

/** Props for {@link PersonalProjectDashboard}. */
export type PersonalProjectDashboardProps = WithClassNames<undefined>

/** github.com URL → `owner/repo` (drops scheme + trailing .git) for a compact label. */
const toRepoLabel = (url: string): string =>
    url
        .trim()
        .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
        .replace(/\.git$/i, "")
        .replace(/\/$/, "")

/**
 * Personal-project landing DASHBOARD — shown by {@link
 * import("../PersonalProjectWorkspace").PersonalProjectWorkspace} when the URL has
 * no `tasks/[id]` (overview instead of an empty column).
 *
 * Mirrors the course-content home (`CourseContents`) layout so the two learn home
 * surfaces read consistently: TIER-1 breadcrumb → TIER-2 header (project title +
 * description + a GitHub status chip) → TIER-3 a {@link ContinueCard} `hero` for
 * the next task (chip "Tiếp tục") + progress meter, above the keep-going path =
 * current milestone tasks as {@link ContinueCard} `item` cards (with per-card
 * "Tiếp tục >" CTA) in a frameless {@link LabeledCard} grid. The milestone LIST
 * for the whole project lives in the left rail — the body only surfaces "where
 * you are + what's next". Every value is grounded in real BE fields
 * (`milestoneTaskProgress`, enrollment github).
 *
 * @param props - {@link PersonalProjectDashboardProps}
 */
export const PersonalProjectDashboard = ({
    className,
}: PersonalProjectDashboardProps = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // github connection truth lives on the enrollment (the github store is only seeded inside
    // the task panel, which isn't mounted on the dashboard) — read it straight from redux
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const githubUrl = enrollment?.personalProjectGithubUrl ?? ""
    const githubBranch = enrollment?.personalProjectGithubBranch ?? ""

    const milestones = useMemo(
        () => [...milestoneEntities].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [milestoneEntities],
    )
    const completionTasks = progressSwr.data?.milestoneTaskProgress?.data?.completionTasks
    const progressMap = useMemo(
        () => buildMilestoneTaskProgressLookup(completionTasks),
        [completionTasks],
    )
    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    /** The next task to work on, plus the milestone that owns it (for the continue block). */
    const currentTask = useMemo(() => {
        if (!currentTaskId) {
            return undefined
        }
        for (const milestone of milestones) {
            const task = (milestone.tasks ?? []).find((entity) => entity.id === currentTaskId)
            if (task) {
                return task
            }
        }
        return undefined
    }, [milestones, currentTaskId])

    /** The milestone the learner is in: the one owning the next task, else the first. */
    const currentMilestone = useMemo<MilestoneEntity | undefined>(() => {
        if (currentTaskId) {
            const owning = milestones.find((milestone) =>
                (milestone.tasks ?? []).some((task) => task.id === currentTaskId))
            if (owning) {
                return owning
            }
        }
        return milestones[0]
    }, [milestones, currentTaskId])

    /** Aggregate KPIs across every task in the course (grounded in the progress lookup). */
    const stats = useMemo(() => {
        // total comes from the full milestone tree (every task counts)
        let total = 0
        for (const milestone of milestones) {
            total += (milestone.tasks ?? []).length
        }
        // done / attempts / avg score come from the progress rows (carry lastScore/maxScore)
        let done = 0
        let attempts = 0
        let scoreSum = 0
        let maxSum = 0
        let scored = 0
        for (const item of completionTasks ?? []) {
            attempts += item.numAttempts ?? 0
            if (item.completed) {
                done += 1
                if (typeof item.lastScore === "number") {
                    scoreSum += item.lastScore
                    maxSum += item.maxScore ?? 20
                    scored += 1
                }
            }
        }
        return {
            done,
            total,
            attempts,
            avgScore: scored > 0 ? Math.round(scoreSum / scored) : null,
            avgMax: scored > 0 ? Math.round(maxSum / scored) : 20,
        }
    }, [milestones, completionTasks])

    const isConnected = githubUrl.trim().length > 0
    const avgLabel = stats.avgScore != null ? `${stats.avgScore}/${stats.avgMax}` : "—"

    /** Jump into the next task (or the very first one): mirror the rail's select+route. */
    const onContinue = useCallback(() => {
        const taskId = currentTaskId ?? milestones[0]?.tasks?.[0]?.id
        if (!taskId) {
            return
        }
        dispatch(setSelectedTaskId(taskId))
        router.push(
            pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(taskId).build(),
        )
    }, [currentTaskId, milestones, dispatch, router, locale, courseDisplayId])

    /** Open a task from the keep-going path (the locked brief handles its own gate). */
    const onSelectTask = useCallback(
        (taskId: string) => {
            dispatch(setSelectedTaskId(taskId))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(taskId).build(),
            )
        },
        [dispatch, router, locale, courseDisplayId],
    )

    // gate on first load only (cached redux milestones win); brief skeleton while progress lands
    const hasMilestones = milestones.length > 0
    const isLoading = (!hasMilestones && !milestonesSwr.error && (milestonesSwr.isLoading || !milestonesSwr.data))
        || (progressSwr.isLoading && !progressSwr.data)
    const isEmpty = !hasMilestones && !milestonesSwr.isLoading && !!milestonesSwr.data && !milestonesSwr.error

    return (
        <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-10", className)}>
            {/* shared PageHeader: breadcrumb → H3 title → muted desc → github status chip (meta).
                header → content = gap-10 (page-heading debt). */}
            <PageHeader
                breadcrumb={<TaskBreadcrumb />}
                title={t("finalProject.dashboard.title")}
                description={t("finalProject.dashboard.subtitle")}
                meta={(
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip
                            color={isConnected ? "success" : "default"}
                            className={isConnected ? "bg-success-soft text-success-soft-foreground" : undefined}
                        >
                            <GithubLogoIcon className="size-5" />
                            <Chip.Label>
                                {isConnected
                                    ? `${toRepoLabel(githubUrl)} · ${githubBranch || "main"}`
                                    : t("finalProject.dashboard.notConnected")}
                            </Chip.Label>
                        </Chip>
                    </div>
                )}
            />
            {/* content */}
            <AsyncContent
                isLoading={isLoading}
                skeleton={<PersonalProjectDashboardSkeleton />}
                isEmpty={isEmpty}
                emptyContent={{ title: t("finalProject.dashboard.empty") }}
            >
                <div className="flex flex-col gap-6">
                    {/* next task as ContinueCard hero (chip CTA — not the faint
                        LabeledCard see-more link), then the honest progress meter. */}
                    <div className="flex flex-col gap-3">
                        {currentTask ? (
                            <ContinueCard
                                variant="hero"
                                icon={<PlayIcon weight="fill" />}
                                title={`${currentTask.sortIndex}. ${currentTask.title}`}
                                subtitle={t("finalProject.dashboard.nextTask")}
                                ctaLabel={t("finalProject.dashboard.continue")}
                                onPress={onContinue}
                            />
                        ) : (
                            <Typography type="body" weight="semibold">
                                {t("finalProject.dashboard.allDone")}
                            </Typography>
                        )}
                        <ProgressMeter
                            value={stats.done}
                            max={stats.total || 1}
                            label={t("finalProject.dashboard.completion")}
                            showValue
                        />
                        <Typography type="body-xs" color="muted">
                            {t("finalProject.dashboard.statsLine", {
                                done: stats.done,
                                total: stats.total,
                                attempts: stats.attempts,
                                avg: avgLabel,
                            })}
                        </Typography>
                    </div>

                    {/* keep-going: ContinueCard item grid — "Tiếp tục >" lives on each
                        card (Storybook Item), not as a soft see-more beside the label. */}
                    {currentMilestone ? (
                        <LabeledCard
                            label={`${t("finalProject.dashboard.keepGoing")} · ${currentMilestone.title}`}
                            frameless
                            contentClassName="grid gap-3 sm:grid-cols-2"
                        >
                            {(currentMilestone.tasks ?? []).map((task) => {
                                const isCompleted = progressMap.get(task.id)?.completed ?? false
                                const isActive = task.id === currentTaskId
                                const isLocked = !isPersonalProjectTaskActionUnlocked(
                                    task.id,
                                    progressMap,
                                    currentTaskId,
                                )
                                const subtitle = isActive
                                    ? t("finalProject.dashboard.nextTask")
                                    : isCompleted
                                        ? t("finalProject.dashboard.taskDone")
                                        : isLocked
                                            ? t("finalProject.dashboard.statLocked")
                                            : t("finalProject.dashboard.taskTodo")
                                const icon = isActive ? (
                                    <PlayIcon weight="fill" />
                                ) : isCompleted ? (
                                    <CheckCircleIcon weight="fill" />
                                ) : isLocked ? (
                                    <LockIcon weight="fill" />
                                ) : (
                                    <CircleIcon weight="fill" />
                                )
                                return (
                                    <ContinueCard
                                        key={task.id}
                                        variant="item"
                                        icon={icon}
                                        title={`${task.sortIndex}. ${task.title}`}
                                        subtitle={subtitle}
                                        ctaLabel={t("finalProject.dashboard.continue")}
                                        onPress={() => onSelectTask(task.id)}
                                    />
                                )
                            })}
                        </LabeledCard>
                    ) : null}
                </div>
            </AsyncContent>
        </div>
    )
}
