import { CheckCircleIcon, CircleIcon, LockIcon } from "@phosphor-icons/react"
import {
    MilestoneTaskStatus,
} from "./enums"

/**
 * Status icon rendered beside each milestone task, keyed by the
 * task's derived {@link MilestoneTaskStatus}.
 */
export const MILESTONE_TASK_STATUS_ICON_MAP: Record<MilestoneTaskStatus, typeof CircleIcon> = {
    /** Completed task → filled-style check circle. */
    [MilestoneTaskStatus.Completed]: CheckCircleIcon,
    /** Reachable task → open circle. */
    [MilestoneTaskStatus.Unlocked]: CircleIcon,
    /** Locked task → padlock. */
    [MilestoneTaskStatus.Locked]: LockIcon,
}
