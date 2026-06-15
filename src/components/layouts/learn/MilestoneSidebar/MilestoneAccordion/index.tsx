"use client"

import React from "react"
import {
    Accordion,
    cn,
} from "@heroui/react"
import type {
    MilestoneEntity,
    WithClassNames,
} from "@/modules/types"
import type {
    MilestoneTaskProgressLookup,
} from "@/components/utils"
import {
    resolveMilestoneTaskStatus,
} from "../utils"
import {
    MilestoneTaskRow,
} from "./MilestoneTaskRow"

/**
 * Props for {@link MilestoneAccordion}.
 */
export interface MilestoneAccordionProps extends WithClassNames<undefined> {
    /** Milestones to render, already ordered. */
    milestones: Array<MilestoneEntity>
    /** Task id → completion lookup for status derivation. */
    progressMap: MilestoneTaskProgressLookup
    /** Currently selected task id. */
    selectedTaskId?: string
    /** Predicate: whether a task id is unlocked (reachable). */
    isTaskUnlocked: (taskId: string) => boolean
    /** Fired with the task id when a task row is pressed. */
    onSelectTask: (taskId: string) => void
}

/**
 * Accordion of milestones, each expanding to its ordered task rows.
 *
 * Presentational: maps milestones/tasks → {@link MilestoneTaskRow}, deriving
 * each task's status via pure helpers. `"use client"` for the HeroUI accordion.
 * @param props - milestones, progress lookup, selection, and callbacks
 */
export const MilestoneAccordion = ({
    milestones,
    progressMap,
    selectedTaskId,
    isTaskUnlocked,
    onSelectTask,
    className,
}: MilestoneAccordionProps) => {
    return (
        <Accordion
            variant="default"
            className={cn("rounded-none border-none px-0 shadow-none", className)}
            defaultExpandedKeys={milestones.map((milestone) => String(milestone.id))}
        >
            {milestones.map((milestone) => {
                const tasks = milestone.tasks
                    ?.slice()
                    ?.sort((prev, next) => prev.sortIndex - next.sortIndex) ?? []
                return (
                    <Accordion.Item
                        key={String(milestone.id)}
                        id={String(milestone.id)}
                    >
                        <Accordion.Heading>
                            <Accordion.Trigger className="w-full p-3">
                                <div className="flex w-full items-center justify-between gap-1.5">
                                    <span className="min-w-0 flex-1 cursor-pointer text-start text-base font-semibold">
                                        {`${milestone.sortIndex}. ${milestone.title || "Milestone"}`}
                                    </span>
                                    <Accordion.Indicator />
                                </div>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body className="p-3">
                                <div className="flex flex-col gap-3">
                                    {tasks.map((task, index) => {
                                        const progress = progressMap.get(task.id)
                                        const status = resolveMilestoneTaskStatus({
                                            completed: progress?.completed ?? false,
                                            unlocked: isTaskUnlocked(task.id),
                                        })
                                        return (
                                            <MilestoneTaskRow
                                                key={task.id}
                                                task={task}
                                                status={status}
                                                selected={selectedTaskId === task.id}
                                                isLast={index === tasks.length - 1}
                                                onSelectTask={onSelectTask}
                                            />
                                        )
                                    })}
                                </div>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    )
}
