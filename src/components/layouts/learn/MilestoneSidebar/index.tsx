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
import {
    MilestoneIndexStrip,
} from "./MilestoneIndexStrip"

/**
 * Props for {@link MilestoneSidebar}.
 */
type MilestoneSidebarProps = WithClassNames<undefined> & {
    /** Collapsed mode: render a slim numbered index instead of the full list. */
    collapsed?: boolean
}

/**
 * Milestone navigation sidebar for the personal-project learn view.
 *
 * Container: owns the milestones/progress SWR singletons, redux selection,
 * task unlock logic, and the select-task navigation; renders the
 * presentational {@link MilestoneAccordion}. `"use client"` for hooks.
 * @param props - optional container class name
 */
export const MilestoneSidebar = ({ className, collapsed = false }: MilestoneSidebarProps) => {
    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
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

    /** Milestone that owns the currently selected task — highlighted in the collapsed rail. */
    const activeMilestoneId = useMemo(() => {
        if (!selectedTaskId) {
            return undefined
        }
        const owner = milestones.find((milestone) =>
            (milestone.tasks ?? []).some((task) => task.id === selectedTaskId),
        )
        return owner ? String(owner.id) : undefined
    }, [
        milestones,
        selectedTaskId,
    ])

    /** Collapsed-rail press: jump to the first task of the chosen milestone. */
    const onSelectMilestone = useCallback(
        (milestoneId: string) => {
            const milestone = milestones.find((entity) => String(entity.id) === milestoneId)
            const firstTask = (milestone?.tasks ?? [])
                .slice()
                .sort((prev, next) => prev.sortIndex - next.sortIndex)[0]
            if (firstTask) {
                onSelectTask(firstTask.id)
            }
        },
        [
            milestones,
            onSelectTask,
        ],
    )

    /**
     * Loading gate: prefer cached redux milestones (SWR hydrates into `milestone.entities`);
     * otherwise wait for the singleton query to settle.
     */
    const ready = milestones.length > 0
        || (!milestonesSwr.isLoading && !!milestonesSwr.data && !milestonesSwr.error)

    // shared sticky/scroll shell so every render branch lines up under the navbar
    const shellClass = cn("lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto", className)

    // collapsed rail: show only the slim numbered index (clicking a number jumps to that milestone)
    if (collapsed) {
        return (
            <div className={shellClass}>
                <MilestoneIndexStrip
                    milestones={milestones}
                    activeMilestoneId={activeMilestoneId}
                    onSelectMilestone={onSelectMilestone}
                />
            </div>
        )
    }

    return (
        <div className={shellClass}>
            <div>
                <MilestoneTaskSearch
                    className="p-3"
                    milestones={milestones}
                    value={selectedTaskId ?? null}
                    onSelectTask={onSelectTask}
                />
            </div>
            {/* divider separating the search field from the milestone list — sits flush
                against the accordion; the trigger's own padding gives the breathing room */}
            <Separator />
            {
                ready ? (
                    <MilestoneAccordion
                        milestones={milestones}
                        progressMap={progressMap}
                        selectedTaskId={selectedTaskId}
                        isTaskUnlocked={isTaskUnlocked}
                        onSelectTask={onSelectTask}
                    />
                ) : (
                    <MilestoneSidebarSkeleton count={5} />
                )
            }
        </div>
    )
}
