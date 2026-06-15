/**
 * Visual status of a milestone task row, derived from progress + unlock state.
 */
export enum MilestoneTaskStatus {
    /** Task has been completed. */
    Completed = "completed",
    /** Task is reachable but not yet completed. */
    Unlocked = "unlocked",
    /** Task is locked behind earlier incomplete tasks. */
    Locked = "locked",
}
