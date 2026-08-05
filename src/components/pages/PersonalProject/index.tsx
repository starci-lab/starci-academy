"use client"

import React, { useCallback, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils/task-lookup"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedTaskId } from "@/redux/slices/milestone"
import { useQueryMilestonesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestonesSwr"
import { useQueryMilestoneTaskProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestoneTaskProgressSwr"
import { pathConfig } from "@/resources/path"
import { _PersonalProject, type PersonalProjectTask } from "./component"
import type { MilestoneEntity } from "@/modules/types/entities/milestone"

/** github.com URL → `owner/repo` (drops scheme + trailing .git) for a compact label. */
const toRepoLabel = (url: string): string =>
    url
        .trim()
        .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
        .replace(/\.git$/i, "")
        .replace(/\/$/, "")

/**
 * Personal-project home — the CONNECTED half of the `/learn/personal-project` dashboard (no
 * `tasks/[id]` in the URL): reads the milestone tree + per-task progress (SWR-deduped with the
 * task workspace), derives the current task/milestone + aggregate KPIs, resolves every label, and
 * hands the built rows to the presentational {@link _PersonalProject}. Mirrors the real
 * `PersonalProjectDashboard` feature component's data derivation 1:1 — see
 * `src/components/features/learn/PersonalProject/PersonalProjectDashboard/index.tsx`.
 */
export const PersonalProject = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // github connection truth lives on the enrollment (the github store is only seeded inside
    // the task panel, which isn't mounted on the dashboard) — read it straight from redux, same
    // as the real feature component.
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

    /** The next task to work on. */
    const currentTaskEntity = useMemo(() => {
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

    /** The milestone the learner is currently in: the one owning the next task, else the first. */
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

    /** Aggregate KPIs across every task in the course, grounded in the progress lookup. */
    const stats = useMemo(() => {
        let total = 0
        for (const milestone of milestones) {
            total += (milestone.tasks ?? []).length
        }
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

    /** Open a task from the keep-going grid (the locked brief handles its own gate). */
    const onSelectTask = useCallback(
        (taskId: string) => {
            dispatch(setSelectedTaskId(taskId))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(taskId).build(),
            )
        },
        [dispatch, router, locale, courseDisplayId],
    )

    // Current milestone's tasks → the keep-going grid tiles (state + press handler resolved
    // here, so the presentational file takes plain data — same convention as
    // `CourseContents`'s `lessons`).
    const tasks = useMemo<Array<PersonalProjectTask>>(() => {
        if (!currentMilestone) {
            return []
        }
        return (currentMilestone.tasks ?? []).map((task) => {
            const isCompleted = progressMap.get(task.id)?.completed ?? false
            const isActive = task.id === currentTaskId
            const isLocked = !isPersonalProjectTaskActionUnlocked(task.id, progressMap, currentTaskId)
            return {
                id: task.id,
                sortIndex: task.sortIndex,
                title: task.title,
                subtitleState: isActive ? "active" : isCompleted ? "done" : isLocked ? "locked" : "todo",
                onPress: () => onSelectTask(task.id),
            }
        })
    }, [currentMilestone, currentTaskId, progressMap, onSelectTask])

    // gate on first load only (cached redux milestones win); brief skeleton while progress lands
    const hasMilestones = milestones.length > 0
    const isLoading = (!hasMilestones && !milestonesSwr.error && (milestonesSwr.isLoading || !milestonesSwr.data))
        || (progressSwr.isLoading && !progressSwr.data)
    const isEmpty = !hasMilestones && !milestonesSwr.isLoading && !!milestonesSwr.data && !milestonesSwr.error

    return (
        <_PersonalProject
            isLoading={isLoading}
            error={!hasMilestones ? milestonesSwr.error : undefined}
            onRetry={() => {
                void milestonesSwr.mutate()
                void progressSwr.mutate()
            }}
            isEmpty={isEmpty}
            title={t("finalProject.dashboard.title")}
            description={t("finalProject.dashboard.subtitle")}
            githubStatus={{
                isConnected,
                label: isConnected
                    ? `${toRepoLabel(githubUrl)} · ${githubBranch || "main"}`
                    : t("finalProject.dashboard.notConnected"),
            }}
            currentTask={currentTaskEntity ? {
                sortIndex: currentTaskEntity.sortIndex,
                title: currentTaskEntity.title,
            } : undefined}
            onContinue={onContinue}
            stats={{
                done: stats.done,
                total: stats.total,
                attempts: stats.attempts,
                avgLabel,
            }}
            milestoneLabel={currentMilestone?.title}
            tasks={tasks}
            onSelectTask={onSelectTask}
            labels={{
                emptyTitle: t("finalProject.dashboard.empty"),
                errorTitle: t("finalProject.dashboard.error"),
                retry: t("finalProject.dashboard.retry"),
                nextTask: t("finalProject.dashboard.nextTask"),
                allDone: t("finalProject.dashboard.allDone"),
                completion: t("finalProject.dashboard.completion"),
                statsLine: t("finalProject.dashboard.statsLine", {
                    done: stats.done,
                    total: stats.total,
                    attempts: stats.attempts,
                    avg: avgLabel,
                }),
                keepGoing: t("finalProject.dashboard.keepGoing"),
                notConnected: t("finalProject.dashboard.notConnected"),
                taskDone: t("finalProject.dashboard.taskDone"),
                taskLocked: t("finalProject.dashboard.statLocked"),
                taskTodo: t("finalProject.dashboard.taskTodo"),
            }}
        />
    )
}
