"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    cn,
    Separator,
} from "@heroui/react"
import {
    useRouter,
} from "next/navigation"
import {
    useLocale,
} from "next-intl"
import {
    useQueryMilestonesSwr,
    useQueryMilestoneTaskProgressSwr,
} from "@/hooks"
import {
    useAppSelector,
    useAppDispatch,
} from "@/redux"
import {
    setSelectedTaskId,
} from "@/redux/slices"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources/path"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
import {
    MilestoneSidebarSkeleton,
} from "./MilestoneSidebarSkeleton"
import {
    MilestoneAccordion,
} from "./MilestoneAccordion"
import {
    MilestoneTaskSearch,
} from "./MilestoneTaskSearch"

/**
 * Props for {@link MilestoneSidebar}.
 */
type MilestoneSidebarProps = WithClassNames<undefined>

/**
 * Milestone navigation sidebar for the personal-project learn view.
 *
 * Container: owns the milestones/progress SWR singletons, redux selection,
 * task unlock logic, and the select-task navigation; renders the
 * presentational {@link MilestoneAccordion}. `"use client"` for hooks.
 * @param props - optional container class name
 */
export const MilestoneSidebar = ({ className }: MilestoneSidebarProps) => {
    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const isLoading = milestonesSwr.isLoading
    const dispatch = useAppDispatch()
    const router = useRouter()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)

    /** Milestones sorted by their display order. */
    const milestones = useMemo(
        () => [...milestoneEntities].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [
            milestoneEntities,
        ],
    )

    /** Build a map of taskId -> progress item for quick lookup. */
    const progressMap = useMemo(
        () => buildMilestoneTaskProgressLookup(
            progressSwr.data?.milestoneTaskProgress?.data?.completionTasks,
        ),
        [
            progressSwr.data,
        ],
    )

    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    /** Determine if a task is unlocked (all previous tasks completed or it's the current task). */
    const isTaskUnlocked = useCallback(
        (taskId: string) => isPersonalProjectTaskActionUnlocked(taskId, progressMap, currentTaskId),
        [
            progressMap,
            currentTaskId,
        ],
    )

    /** Select a task: store the id in redux and route to its learn page. */
    const onSelectTask = useCallback(
        (taskId: string) => {
            dispatch(setSelectedTaskId(taskId))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(taskId).build(),
            )
        },
        [
            dispatch,
            router,
            locale,
            courseDisplayId,
        ],
    )

    if (isLoading && milestones.length === 0) {
        return <MilestoneSidebarSkeleton className={className} />
    }

    return (
        <div className={cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", className)}>
            <div>
                <MilestoneTaskSearch
                    className="p-3"
                    milestones={milestones}
                    value={selectedTaskId ?? null}
                    onSelectTask={onSelectTask}
                />
            </div>
            {/* divider separating the search field from the milestone list */}
            <Separator className="mb-2" />
            <MilestoneAccordion
                milestones={milestones}
                progressMap={progressMap}
                selectedTaskId={selectedTaskId}
                isTaskUnlocked={isTaskUnlocked}
                onSelectTask={onSelectTask}
            />
        </div>
    )
}
