"use client"

import React, {
    useCallback,
} from "react"
import {
    cn,
    Link,
} from "@heroui/react"
import type {
    MilestoneTaskEntity,
    WithClassNames,
} from "@/modules/types"
import {
    MilestoneTaskStatus,
} from "../../enums"
import {
    MILESTONE_TASK_STATUS_ICON_MAP,
} from "../../map"

/**
 * Props for {@link MilestoneTaskRow}.
 */
export interface MilestoneTaskRowProps extends WithClassNames<undefined> {
    /** Task this row renders. */
    task: MilestoneTaskEntity
    /** Derived visual status (completed / unlocked / locked). */
    status: MilestoneTaskStatus
    /** Whether this task is the selected one. */
    selected: boolean
    /** Whether this is the last task in its milestone (hides the divider). */
    isLast: boolean
    /** Fired with the task id when the row is pressed. */
    onSelectTask: (taskId: string) => void
}

/**
 * One milestone task row: status icon + title link + description.
 *
 * Presentational: renders a single task and forwards a thin select callback.
 * `"use client"` for the press handler.
 * @param props - task, status, selected/last state, and select callback
 */
export const MilestoneTaskRow = ({
    task,
    status,
    selected,
    isLast,
    onSelectTask,
    className,
}: MilestoneTaskRowProps) => {
    const StatusIcon = MILESTONE_TASK_STATUS_ICON_MAP[status]
    const iconClass = cn(
        "size-5 shrink-0 text-foreground",
        selected && "text-accent",
    )
    const onPress = useCallback(
        () => onSelectTask(task.id),
        [
            task.id,
            onSelectTask,
        ],
    )
    return (
        <div className={cn(className)}>
            <div className="flex items-start gap-3">
                {/* Status icon: shape by progress; color only accent when selected */}
                <div className="mt-0.5 shrink-0">
                    <StatusIcon className={iconClass} />
                </div>

                {/* Task content */}
                <div className="min-w-0 flex-1">
                    <Link
                        className={cn(
                            "font-medium text-foreground",
                            selected && "text-accent",
                        )}
                        onPress={onPress}
                    >
                        {`${task.sortIndex}. ${task.title}`}
                    </Link>
                    {task.description && (
                        <>
                            <div className="h-1.5" />
                            <div className="line-clamp-3 text-xs text-muted">
                                {task.description}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="h-3" />
            {!isLast && <div className="border-t " />}
        </div>
    )
}
