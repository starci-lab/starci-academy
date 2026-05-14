"use client"

import React, { useMemo } from "react"
import { cn, Skeleton, Accordion, Link, Separator } from "@heroui/react"
import { useQueryMilestonesSwr, useQueryMilestoneTaskProgressSwr } from "@/hooks/singleton"
import { useAppSelector, useAppDispatch } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import { WithClassNames } from "@/modules/types"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources/path"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
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
    const progressMap = useMemo(
        () => buildMilestoneTaskProgressLookup(
            progressSwr.data?.milestoneTaskProgress?.data?.completionTasks,
        ),
        [progressSwr.data],
    )

    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    /** Determine if a task is unlocked (all previous tasks completed or it's the current task) */
    const isTaskUnlocked = (taskId: string) => {
        return isPersonalProjectTaskActionUnlocked(taskId, progressMap, currentTaskId)
    }

    if ((isLoading && milestones.length === 0)) {
        return (
            <div className={
                cn(
                    "lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto",
                    className,
                )}>
                <div className="p-3 pb-[6px]">
                    <Skeleton className="h-4 w-2/3 rounded-2xl my-2" />
                </div>
                <div className="p-3">
                    {
                        Array.from(
                            { length: 3 }
                        ).map((_, index) => (
                            <React.Fragment key={index}>
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-5 min-w-5 min-h-5 rounded-full" />
                                    <div className="flex flex-col w-full">
                                        <Skeleton className="h-[14px] w-2/3 rounded-full my-[3px] mb-2" />
                                        <div className="flex flex-col">
                                            <Skeleton className="h-3 w-full rounded-full my-0.5" />
                                            <Skeleton className="h-3 w-2/3 rounded-full my-0.5" />
                                            <Skeleton className="h-3 w-1/2 rounded-full my-0.5" />
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-3 last:hidden" />
                            </React.Fragment>
                        ))
                    }
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
                                                const isSelected = selectedTaskId === task.id
                                                const iconClass = cn(
                                                    "size-5 shrink-0 text-foreground",
                                                    isSelected && "text-accent",
                                                )

                                                return (
                                                    <div key={task.id}>
                                                        <div className="flex items-start gap-3">
                                                            {/* Status icon: shape by progress; color only accent when selected */}
                                                            <div className="mt-0.5 shrink-0">
                                                                {completed ? (
                                                                    <CheckCircleIcon className={iconClass} />
                                                                ) : unlocked ? (
                                                                    <CircleIcon className={iconClass} />
                                                                ) : (
                                                                    <LockIcon className={iconClass} />
                                                                )}
                                                            </div>

                                                            {/* Task Content */}
                                                            <div className="min-w-0 flex-1">
                                                                <Link
                                                                    className={cn(
                                                                        "font-medium text-foreground",
                                                                        isSelected && "text-accent",
                                                                    )}
                                                                    onPress={() => {
                                                                        dispatch(setSelectedTaskId(task.id))
                                                                        router.push(
                                                                            pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(task.id).build(),
                                                                        )
                                                                    }}
                                                                >
                                                                    {`${task.orderIndex + 1}. ${task.title}`}
                                                                </Link>
                                                                {task.description && (
                                                                    <>
                                                                        <div className="h-2" />
                                                                        <div className="line-clamp-3 text-xs text-muted">
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
