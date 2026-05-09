"use client"

import React, { useMemo } from "react"
import { Accordion, cn, Skeleton } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useQueryMilestonesSwr } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { WithClassNames } from "@/modules/types"

type MilestonesProps = WithClassNames<undefined>

/**
 * Renders milestone progress cards for the personal project page.
 *
 * @returns Milestones sidebar with loading, empty, and data states.
 */
export const Milestones = ({ className }: MilestonesProps) => {
    const t = useTranslations()
    const { isLoading: isMilestonesLoading } = useQueryMilestonesSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const milestones = useMemo(
        () => [...milestoneEntities].sort((prev, next) => prev.orderIndex - next.orderIndex),
        [milestoneEntities],
    )

    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", className)}>
            {isMilestonesLoading ? (
                <div className="flex flex-col gap-3 p-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                    ))}
                </div>
            ) : milestones.length === 0 ? (
                <div className="p-3 text-sm text-muted">{t("finalProject.page.milestones.empty", { defaultMessage: "No milestones available." })}</div>
            ) : (
                <Accordion
                    variant="default"
                    className="rounded-none border-none px-0 shadow-none"
                    allowsMultipleExpanded
                >
                    {milestones.map((milestone, milestoneIndex) => (
                        <Accordion.Item key={milestone.id} id={milestone.id}>
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full">
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <span
                                            className={
                                                cn(
                                                    "min-w-0 flex-1 cursor-pointer text-start text-base font-semibold",
                                                )
                                            }
                                        >
                                            {t("finalProject.page.milestones.week")} {milestoneIndex + 1}
                                            {". "}
                                            {milestone.title}
                                        </span>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className="p-3">
                                    <div className="flex flex-col gap-3">
                                        {milestone.tasks
                                            .slice()
                                            .sort((prev, next) => prev.orderIndex - next.orderIndex)
                                            .map((task, index) => (
                                                <div key={task.id}>
                                                    <div>
                                                        <div className="font-medium text-foreground">
                                                            {`${task.orderIndex + 1}. ${task.title}`}
                                                        </div>
                                                        <div className="h-2" />
                                                        <div className="line-clamp-3 text-xs text-muted">
                                                            {task.description}
                                                        </div>
                                                        {task.passCriteria && task.passCriteria.length > 0 ? (
                                                            <>
                                                                <div className="h-2" />
                                                                <ul className="list-disc pl-4">
                                                                    {task.passCriteria
                                                                        .slice()
                                                                        .sort((prev, next) => prev.orderIndex - next.orderIndex)
                                                                        .map((criterion) => (
                                                                            <li key={criterion.id} className="text-xs text-muted">
                                                                                {criterion.text}
                                                                            </li>
                                                                        ))}
                                                                </ul>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    <div className="h-3" />
                                                    {index !== milestone.tasks.length - 1 && <div className="border-t " />}
                                                </div>
                                            ))}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    )
}
