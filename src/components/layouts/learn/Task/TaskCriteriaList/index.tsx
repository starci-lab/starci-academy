"use client"

import React from "react"
import {
    Accordion,
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    MarkdownContent,
} from "@/components/reuseable"
import type {
    MilestoneTaskCriteriaEntity,
} from "@/modules/types"

/** Props for {@link TaskCriteriaList}. */
export interface TaskCriteriaListProps {
    /** Criteria sorted by display order. */
    criterias: Array<MilestoneTaskCriteriaEntity>
}

/**
 * Accordion list of pass criteria with score chips and markdown hints.
 *
 * Presentational: renders the supplied sorted criteria, no logic.
 * @param props - the sorted criteria rows
 */
export const TaskCriteriaList = ({
    criterias,
}: TaskCriteriaListProps) => {
    const t = useTranslations()
    return (
        <>
            <div className="h-3" />
            <Accordion allowsMultipleExpanded variant="surface">
                {criterias.map((criteria, index) => (
                    <Accordion.Item key={criteria.id}>
                        <Accordion.Heading>
                            <Accordion.Trigger className="w-full p-3">
                                <div className="flex w-full items-center gap-3">
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="text-sm">
                                            {index + 1}. {criteria.text}
                                        </div>
                                    </div>
                                    <Chip size="sm" variant="secondary" color="accent">
                                        {t("task.criteriaScore", { score: criteria.score })}
                                    </Chip>
                                    <Accordion.Indicator />
                                </div>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body>
                                {criteria.hint ? (
                                    <div className="pl-9">
                                        <MarkdownContent markdown={criteria.hint} />
                                    </div>
                                ) : (
                                    <div className="pl-9 text-sm text-muted italic">
                                        {t("task.criteriaNoHint")}
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    )
}
