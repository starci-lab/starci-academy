"use client"

import React, {
    useMemo,
} from "react"
import { useAppSelector } from "@/redux"
import {
    Separator,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    useQueryMilestoneTaskSwr,
} from "@/hooks"
import {
    TaskSkeleton,
} from "./TaskSkeleton"
import {
    TaskLockedAlert,
} from "./TaskLockedAlert"
import {
    TaskBrief,
} from "./TaskBrief"
import {
    TaskCriteriaList,
} from "./TaskCriteriaList"
import {
    TaskCodeImplementations,
} from "./TaskCodeImplementations"
import {
    TaskResults,
} from "./TaskResults"
import {
    TaskActions,
} from "./TaskActions"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link Task}. */
export type TaskProps = WithClassNames<undefined>

/**
 * Milestone task detail container.
 *
 * Reads the active task from redux, renders its title + description, then mounts
 * self-contained sub-sections (brief, criteria, code implementations, results,
 * actions). Each sub-section owns its own data reads — the container only
 * provides the structural layout and the loading/empty gate.
 * `"use client"` for redux selectors.
 * @param props - optional className for the root element
 */
export const Task = ({
    className,
}: TaskProps = {}) => {
    const t = useTranslations()
    const milestoneTaskQuery = useQueryMilestoneTaskSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)

    const taskFromMilestones = useMemo(() => {
        if (!selectedTaskId) return undefined
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((task) => task.id === selectedTaskId)
            if (found) return found
        }
        return undefined
    }, [milestoneEntities, selectedTaskId])

    const displayTask = useMemo(() => {
        if (!selectedTaskId) return undefined
        if (selectedTaskDetail?.id === selectedTaskId) {
            return selectedTaskDetail
        }
        return taskFromMilestones
    }, [selectedTaskId, selectedTaskDetail, taskFromMilestones])

    if (!displayTask || milestoneTaskQuery.isLoading || !selectedTaskId) {
        return <TaskSkeleton />
    }

    return (
        <div className={cn(className)}>
            <Separator />
            <div className="p-3">
                <div className="text-lg font-semibold">{displayTask.title}</div>
                {displayTask.description && (
                    <div className="text-muted mt-2 text-sm">{displayTask.description}</div>
                )}
                <div className="h-3" />
                <TaskLockedAlert />
                <TaskBrief />
                {/* SCHEMA V2 tasks (with briefs) keep their rubric internal — the legacy
                    public criteria + codeImplementations are only shown for old tasks. */}
                {(displayTask.briefs?.length ?? 0) === 0 && (
                    <>
                        <div className="font-semibold">
                            {t("task.criteriaTitle")}
                        </div>
                        <TaskCriteriaList />
                        <TaskCodeImplementations />
                    </>
                )}
                <TaskResults />
                <TaskActions />
            </div>
        </div>
    )
}
