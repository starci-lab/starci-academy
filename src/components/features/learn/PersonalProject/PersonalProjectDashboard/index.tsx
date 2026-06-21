"use client"

import React, { useCallback, useMemo } from "react"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { GithubLogoIcon, PlayIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import {
    useQueryMilestonesSwr,
    useQueryMilestoneTaskProgressSwr,
} from "@/hooks"
import { pathConfig } from "@/resources"
import {
    AsyncContent,
    LabeledCard,
    ProgressMeter,
    StatPair,
} from "@/components/blocks"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils/task-lookup"
import { PersonalProjectDashboardSkeleton } from "./PersonalProjectDashboardSkeleton"
import { TaskBreadcrumb } from "../TaskBreadcrumb"
import type { WithClassNames } from "@/modules/types/base/class-name"

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
 * Three-tier reading column: an H3 header (the project) over the data. The body is
 * a 3-up KPI row — overall **progress**, the **next task** with the one primary
 * action ("Tiếp tục" → routes to `currentTask`), and **GitHub** connection status —
 * above a 4-stat ribbon (passed / locked / attempts / avg score). The milestone
 * LIST is intentionally NOT repeated here — the left rail owns navigation. Every
 * value is grounded in real BE fields (`milestoneTaskProgress`, enrollment github).
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

    /** The next task to work on, plus the milestone that owns it (for the "Tiếp tục" card). */
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

    /** Aggregate KPIs across every task in the course (grounded in the progress lookup). */
    const stats = useMemo(() => {
        // total + locked come from the full milestone tree (every task counts)
        let total = 0
        let locked = 0
        for (const milestone of milestones) {
            for (const task of milestone.tasks ?? []) {
                total += 1
                if (!isPersonalProjectTaskActionUnlocked(task.id, progressMap, currentTaskId)) {
                    locked += 1
                }
            }
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
            locked,
            attempts,
            avgScore: scored > 0 ? Math.round(scoreSum / scored) : null,
            avgMax: scored > 0 ? Math.round(maxSum / scored) : 20,
        }
    }, [milestones, progressMap, currentTaskId, completionTasks])

    const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0
    const isConnected = githubUrl.trim().length > 0

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

    // gate on first load only (cached redux milestones win); brief skeleton while progress lands
    const hasMilestones = milestones.length > 0
    const isLoading = (!hasMilestones && !milestonesSwr.error && (milestonesSwr.isLoading || !milestonesSwr.data))
        || (progressSwr.isLoading && !progressSwr.data)
    const isEmpty = !hasMilestones && !milestonesSwr.isLoading && !!milestonesSwr.data && !milestonesSwr.error

    return (
        <div className={cn("mx-auto w-full max-w-3xl", className)}>
            {/* tier-1 breadcrumb — shares the shell's single p-6 (no separate padded wrapper) */}
            <TaskBreadcrumb />
            <div className="h-3" />
            {/* tier-2 header: project title (H3) + description, gap-2 pair */}
            <div className="flex flex-col gap-2">
                <Typography type="h3" weight="bold">{t("finalProject.dashboard.title")}</Typography>
                <Typography type="body-sm" color="muted">{t("finalProject.dashboard.subtitle")}</Typography>
            </div>
            <div className="h-3" />
            {/* tier-3 content */}
            <AsyncContent
                isLoading={isLoading}
                skeleton={<PersonalProjectDashboardSkeleton />}
                isEmpty={isEmpty}
                emptyContent={{ title: t("finalProject.dashboard.empty") }}
            >
                <div className="flex flex-col gap-6">
                    {/* 3-up KPI cards */}
                    <div className="grid gap-3 sm:grid-cols-3">
                        {/* overall progress */}
                        <LabeledCard
                            label={t("finalProject.dashboard.progress")}
                            contentClassName="flex flex-col gap-3"
                        >
                            <Typography type="h3" weight="bold">{percent}%</Typography>
                            <ProgressMeter value={stats.done} max={stats.total || 1} />
                            <Typography type="body-xs" color="muted">
                                {t("finalProject.dashboard.tasksDone", {
                                    done: stats.done,
                                    total: stats.total,
                                })}
                            </Typography>
                        </LabeledCard>
                        {/* next task — the single primary action */}
                        <LabeledCard
                            label={t("finalProject.dashboard.nextTask")}
                            contentClassName="flex flex-col gap-3"
                        >
                            {currentTask ? (
                                <>
                                    <Typography type="body" weight="medium" className="line-clamp-2">
                                        {currentTask.sortIndex}. {currentTask.title}
                                    </Typography>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="self-start"
                                        onPress={onContinue}
                                    >
                                        <PlayIcon aria-hidden focusable="false" className="size-4" />
                                        {t("finalProject.dashboard.continue")}
                                    </Button>
                                </>
                            ) : (
                                <Chip
                                    size="sm"
                                    variant="secondary"
                                    color="success"
                                    className="self-start bg-success/10 text-success"
                                >
                                    <Chip.Label>{t("finalProject.dashboard.allDone")}</Chip.Label>
                                </Chip>
                            )}
                        </LabeledCard>
                        {/* github connection status */}
                        <LabeledCard
                            label={t("finalProject.dashboard.github")}
                            icon={<GithubLogoIcon aria-hidden focusable="false" className="size-4" />}
                            contentClassName="flex flex-col gap-2"
                        >
                            {isConnected ? (
                                <>
                                    <Chip
                                        size="sm"
                                        variant="secondary"
                                        color="success"
                                        className="self-start bg-success/10 text-success"
                                    >
                                        <Chip.Label>{t("finalProject.dashboard.connected")}</Chip.Label>
                                    </Chip>
                                    <Typography type="body-xs" color="muted" className="truncate">
                                        {toRepoLabel(githubUrl)} · {githubBranch || "main"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("finalProject.dashboard.notConnected")}
                                </Typography>
                            )}
                        </LabeledCard>
                    </div>
                    {/* 4-stat ribbon */}
                    <div className="flex flex-wrap gap-6 border-t border-default-200 pt-3">
                        <StatPair value={stats.done} label={t("finalProject.dashboard.statDone")} />
                        <StatPair value={stats.locked} label={t("finalProject.dashboard.statLocked")} />
                        <StatPair value={stats.attempts} label={t("finalProject.dashboard.statAttempts")} />
                        <StatPair
                            value={stats.avgScore != null ? `${stats.avgScore}/${stats.avgMax}` : "—"}
                            label={t("finalProject.dashboard.statAvg")}
                        />
                    </div>
                </div>
            </AsyncContent>
        </div>
    )
}
