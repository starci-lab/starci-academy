import type { IconComponent } from "@/types"
import { Circle as CircleIcon, CircleCheck as CheckCircleIcon, Lock as LockIcon } from "@gravity-ui/icons"
import {
    MilestoneTaskStatus,
} from "./enums"

/**
 * Status icon rendered beside each milestone task, keyed by the
 * task's derived {@link MilestoneTaskStatus}.
 */
export const MILESTONE_TASK_STATUS_ICON_MAP: Record<MilestoneTaskStatus, IconComponent> = {
    /** Completed task → filled-style check circle. */
    [MilestoneTaskStatus.Completed]: CheckCircleIcon,
    /** Reachable task → open circle. */
    [MilestoneTaskStatus.Unlocked]: CircleIcon,
    /** Locked task → padlock. */
    [MilestoneTaskStatus.Locked]: LockIcon,
}
