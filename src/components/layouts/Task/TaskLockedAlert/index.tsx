"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Alert,
    Button,
} from "@heroui/react"
import {
    useTranslations,
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setSelectedTaskId,
} from "@/redux/slices"
import {
    useQueryMilestoneTaskProgressSwr,
} from "@/hooks"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
import {
    pathConfig,
} from "@/resources/path"

/**
 * Warning alert shown when previewing a locked (not-yet-unlocked) task.
 *
 * Self-contained section (single-use): reads the selected/current task ids from
 * redux and the milestone task progress from its singleton SWR query, derives
 * whether the previewed task is locked, and owns the "go to current task"
 * navigation handler. Renders nothing when the action is unlocked, so the task
 * container just drops `<TaskLockedAlert />` in place. `"use client"` for redux,
 * routing and i18n.
 */
export const TaskLockedAlert = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const progressLookup = useMemo(
        () => buildMilestoneTaskProgressLookup(
            progressSwr.data?.milestoneTaskProgress?.data?.completionTasks,
        ),
        [progressSwr.data],
    )
    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    const isActionUnlocked = useMemo(
        () => {
            if (!selectedTaskId) {
                return true
            }
            if (progressSwr.isLoading) {
                return true
            }
            return isPersonalProjectTaskActionUnlocked(
                selectedTaskId,
                progressLookup,
                currentTaskId,
            )
        },
        [
            selectedTaskId,
            progressLookup,
            currentTaskId,
            progressSwr.isLoading,
        ],
    )

    const isActionLocked = Boolean(selectedTaskId) && !isActionUnlocked
    const canGoToCurrentTask = Boolean(
        currentTaskId
        && selectedTaskId
        && currentTaskId !== selectedTaskId,
    )

    /** Navigate to the current (unlocked) task from the locked-preview alert. */
    const onGoToCurrentTask = useCallback(
        () => {
            if (!currentTaskId || !courseDisplayId) {
                return
            }
            dispatch(setSelectedTaskId(currentTaskId))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(currentTaskId).build(),
            )
        },
        [
            currentTaskId,
            courseDisplayId,
            dispatch,
            router,
            locale,
        ],
    )

    if (!isActionLocked) {
        return null
    }

    return (
        <>
            <Alert status="warning" className="shadow-none bg-warning/10">
                <Alert.Indicator />
                <Alert.Content className="gap-2">
                    <Alert.Title>{t("task.previewLockedAlertTitle")}</Alert.Title>
                    <Alert.Description>
                        {t("task.previewLockedAlertDescription")}
                    </Alert.Description>
                    {canGoToCurrentTask ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-fit shrink-0 bg-background text-warning"
                            onPress={onGoToCurrentTask}
                        >
                            {t("task.previewLockedGoToCurrentTaskButton")}
                        </Button>
                    ) : null}
                </Alert.Content>
            </Alert>
            <div className="h-3" />
        </>
    )
}
