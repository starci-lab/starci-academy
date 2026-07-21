"use client"

import React, { useMemo } from "react"
import {
    Chip,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import { ListChecksIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledAccordionCard } from "@/components/blocks/cards/LabeledAccordionCard"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { useAppSelector } from "@/redux/hooks"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"

/** Props for {@link TaskCriteriaList}. */
export type TaskCriteriaListProps = WithClassNames<undefined>

/**
 * Accordion list of pass criteria with score chips and markdown hints.
 *
 * Self-contained: reads sorted criteria from the redux task state, no props needed.
 * @param props - optional className for the root element
 */
export const TaskCriteriaList = ({
    className,
}: TaskCriteriaListProps = {}) => {
    const t = useTranslations()
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)

    const displayTask = useMemo(() => {
        if (!selectedTaskId) return undefined
        if (selectedTaskDetail?.id === selectedTaskId) {
            return selectedTaskDetail
        }
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((task) => task.id === selectedTaskId)
            if (found) return found
        }
        return undefined
    }, [selectedTaskId, selectedTaskDetail, milestoneEntities])

    const sortedCriterias = useMemo(() => {
        if (!displayTask?.criterias) return []
        return _.cloneDeep(displayTask.criterias)
            .sort((prev, next) => prev.sortIndex - next.sortIndex)
    }, [displayTask?.criterias])

    if (sortedCriterias.length === 0) {
        // section sits under the visible "task.criteriaTitle" label, so an empty
        // list needs a proper empty-state instead of a silent null (self-hide is
        // only for un-labeled widgets)
        return (
            <EmptyState
                className={cn(className)}
                icon={<ListChecksIcon weight="duotone" />}
                title={t("task.criteriaEmpty")}
            />
        )
    }

    return (
        // NO `label`: the parent already renders the "task.criteriaTitle" heading
        // above this list — a label here would be label-on-label (accordion.md §3d).
        // The per-criterion score rides in the header via `titleEnd`.
        <LabeledAccordionCard
            className={className}
            allowsMultipleExpanded
            items={sortedCriterias.map((criteria, index) => ({
                id: criteria.id,
                title: `${index + 1}. ${criteria.text}`,
                titleEnd: (
                    <Chip size="sm" variant="secondary" color="accent">
                        {t("task.criteriaScore", { score: criteria.score })}
                    </Chip>
                ),
                body: criteria.hint ? (
                    <MarkdownContent markdown={criteria.hint} />
                ) : (
                    <div className="text-sm text-muted italic">
                        {t("task.criteriaNoHint")}
                    </div>
                ),
            }))}
        />
    )
}
