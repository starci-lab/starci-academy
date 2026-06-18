import {
    MilestoneTaskStatus,
} from "../enums"

/**
 * Parameters for {@link resolveMilestoneTaskStatus}.
 */
export interface ResolveMilestoneTaskStatusParams {
    /** Whether the task has been completed. */
    completed: boolean
    /** Whether the task is reachable (current or all prior tasks done). */
    unlocked: boolean
}

/**
 * Derives the visual status of a milestone task row from its progress flags.
 * Completed wins over unlocked; otherwise locked.
 * @param params - completion and unlock flags
 * @returns the {@link MilestoneTaskStatus} to render
 */
export const resolveMilestoneTaskStatus = ({
    completed,
    unlocked,
}: ResolveMilestoneTaskStatusParams): MilestoneTaskStatus => {
    if (completed) {
        return MilestoneTaskStatus.Completed
    }
    if (unlocked) {
        return MilestoneTaskStatus.Unlocked
    }
    return MilestoneTaskStatus.Locked
}
