"use client"

import React, {
    useMemo,
} from "react"
import { useTranslations } from "next-intl"
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
import { useAppSelector } from "@/redux/hooks"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { RichText } from "@/components/blocks/rendering/RichText"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { useQueryMilestoneTaskSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestoneTaskSwr"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"

/**
 * Milestone task BRIEF column (left side of the split workspace).
 *
 * Reads the active task from redux and renders the reading content: title (H3) +
 * description, then the per-language brief (and the legacy public criteria /
 * implementation guides for old tasks that have no SCHEMA V2 brief). The
 * submission + evaluate + result actions live in the persistent right panel
 * ({@link import("./TaskSubmissionPanel").TaskSubmissionPanel}) — this column only
 * swaps per task; the panel persists across milestones. `"use client"` for redux.
 *
 * DEBT: `TaskSkeleton` still describes this column's shape a second time. Folding it
 * in means the whole reading column rests as itself, which is worth doing once the
 * sections below (`TaskBrief`, `TaskCriteriaList`) each carry their own resting state.
 */
export const Task = () => {
    const t = useTranslations()
    const milestoneTaskQuery = useQueryMilestoneTaskSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const course = useAppSelector((state) => state.course.entity)

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

    const isSkeleton = !displayTask || milestoneTaskQuery.isLoading || !selectedTaskId
    if (isSkeleton) {
        return <TaskSkeleton />
    }

    // SCHEMA V2 tasks (with briefs) keep their rubric internal — the legacy public
    // criteria + codeImplementations show only for old tasks, under ONE labelled card
    // (frameless: the criteria accordion and the implementation guide frame themselves).
    const hasBriefs = (displayTask.briefs?.length ?? 0) > 0
    const showsRelated = Boolean(course?.id && course.displayId && displayTask.title)

    return (
        // tier-2 header (title H3 + desc) stands alone; the brief renders itself as the
        // "Guide" LabeledCard (TaskBrief), so each section here is its own labelled block.
        <StackV
            identity={{ tier: "block", component: "Task" }}
            gap={6}
            items={[
                () => (
                    <StackV
                        gap={3}
                        items={[
                            () => <Typography size="h3" weight="bold" text={displayTask.title} />,
                            ...(displayTask.description
                                ? [() => <RichText text={displayTask.description!} size="body-sm" color="muted" />]
                                : []),
                        ]}
                    />
                ),
                () => <TaskLockedAlert />,
                () => <TaskBrief />,
                ...(hasBriefs ? [] : [() => (
                    <LabeledCard label={t("task.criteriaTitle")} frameless>
                        <StackV
                            gap={5}
                            items={[
                                () => <TaskCriteriaList />,
                                () => <TaskCodeImplementations />,
                            ]}
                        />
                    </LabeledCard>
                )]),
                // quiet, self-hiding "read before you build" — the query is built from the
                // task's own title+description, no typing. Reading column only; the
                // submit/evaluate panel on the right is untouched.
                ...(showsRelated ? [() => (
                    <RelatedContentList
                        courseId={course!.id}
                        courseDisplayId={course!.displayId!}
                        query={`${displayTask.title} ${displayTask.description ?? ""}`}
                        excludeId={displayTask.id}
                        label={t("task.relatedContent.label")}
                    />
                )] : []),
            ]}
        />
    )
}
