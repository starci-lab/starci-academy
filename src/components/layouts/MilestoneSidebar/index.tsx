"use client"

import React, { useMemo } from "react"
import { cn, Skeleton, Accordion, Link } from "@heroui/react"
import { useQueryMilestonesSwr, useQueryMilestoneTaskProgressSwr } from "@/hooks/singleton"
import { useAppSelector, useAppDispatch } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import { WithClassNames } from "@/modules/types"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources/path"
import {
    CheckCircleIcon,
    LockIcon,
    CircleIcon,
} from "@phosphor-icons/react"

type TasksProps = WithClassNames<undefined>

export const MilestoneSidebar = ({ className }: TasksProps) => {
    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const isLoading = milestonesSwr.isLoading
    const dispatch = useAppDispatch()
    const router = useRouter()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)

    const milestones = useMemo(
        () => {
            return [...milestoneEntities].sort((prev, next) => prev.orderIndex - next.orderIndex)
        },
        [milestoneEntities],
    )

    /** Build a map of taskId -> progress item for quick lookup */
    const progressMap = useMemo(() => {
        const map = new Map<string, { completed: boolean }>()
        const items = progressSwr.data?.milestoneTaskProgress?.data?.completionTasks
        if (!items) return map
        for (const item of items) {
            map.set(item.id, { completed: item.completed })
        }
        return map
    }, [progressSwr.data])

    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    /** Determine if a task is unlocked (all previous tasks completed or it's the current task) */
    const isTaskUnlocked = (taskId: string) => {
        const progress = progressMap.get(taskId)
        if (!progress) {
            // No progress data yet — the current task or first task is unlocked
            return taskId === currentTaskId
        }
        return progress.completed || taskId === currentTaskId
    }

    if (isLoading && milestones.length === 0) {
        return (
            <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto p-3", className)}>
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", className)}>
            <Accordion
                variant="default"
                className="rounded-none border-none px-0 shadow-none"
                defaultExpandedKeys={milestones.map(m => String(m.id))}
            >
                {
                    milestones.map((milestone) => (
                        <Accordion.Item
                            key={String(milestone.id)}
                            id={String(milestone.id)}
                        >
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full">
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <span className="min-w-0 flex-1 cursor-pointer text-start text-base font-semibold">
                                            {`${milestone.orderIndex + 1}. ${milestone.title || "Milestone"}`}
                                        </span>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className="p-3">
                                    <div className="flex flex-col gap-3">
                                        {milestone.tasks
                                            ?.slice()
                                            ?.sort((prev, next) => prev.orderIndex - next.orderIndex)
                                            ?.map((task, index) => {
                                                const progress = progressMap.get(task.id)
                                                const completed = progress?.completed ?? false
                                                const unlocked = isTaskUnlocked(task.id)
                                                const isCurrent = task.id === currentTaskId

                                                return (
                                                    <div key={task.id}>
                                                        <div className="flex items-start gap-3">
                                                            {/* Status Icon */}
                                                            <div className="mt-0.5 shrink-0">
                                                                {completed ? (
                                                                    <CheckCircleIcon weight="fill" className="size-5 text-success" />
                                                                ) : unlocked ? (
                                                                    <CircleIcon weight="bold" className={cn("size-5", isCurrent ? "text-accent" : "text-muted")} />
                                                                ) : (
                                                                    <LockIcon weight="fill" className="size-5 text-muted/40" />
                                                                )}
                                                            </div>

                                                            {/* Task Content */}
                                                            <div className="min-w-0 flex-1">
                                                                <Link
                                                                    onPress={() => {
                                                                        if (!unlocked && !completed) return
                                                                        dispatch(setSelectedTaskId(task.id))
                                                                        router.push(
                                                                            pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(task.id).build()
                                                                        )
                                                                    }}
                                                                    className={cn(
                                                                        "cursor-pointer font-medium",
                                                                        !unlocked && !completed
                                                                            ? "text-muted/40 cursor-not-allowed"
                                                                            : selectedTaskId === task.id
                                                                                ? "text-accent"
                                                                                : "text-foreground",
                                                                    )}
                                                                >
                                                                    {`${task.orderIndex + 1}. ${task.title}`}
                                                                </Link>
                                                                {task.description && (
                                                                    <>
                                                                        <div className="h-2" />
                                                                        <div className={cn(
                                                                            "line-clamp-3 text-xs",
                                                                            !unlocked && !completed ? "text-muted/30" : "text-muted"
                                                                        )}>
                                                                            {task.description}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="h-3" />
                                                        {index !== (milestone.tasks?.length ?? 0) - 1 && <div className="border-t " />}
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))
                }
            </Accordion>
        </div>
    )
}
