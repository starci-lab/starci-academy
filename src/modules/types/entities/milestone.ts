import type { AbstractEntity } from "./abstract"

/**
 * Pass criterion for a milestone task.
 */
export interface MilestoneTaskPassCriterionEntity extends AbstractEntity {
    /** The text of the pass criterion. */
    text: string
    /** The order index of the pass criterion. */
    orderIndex: number
}

/**
 * A task within a milestone.
 */
export interface MilestoneTaskEntity extends AbstractEntity {
    /** The title of the task. */
    title: string
    /** The description of the task. */
    description: string
    /** The order index of the task. */
    orderIndex: number
    /** The pass criteria for the task. */
    passCriteria: Array<MilestoneTaskPassCriterionEntity>
}

/**
 * Milestone entity for a course personal project.
 */
export interface MilestoneEntity extends AbstractEntity {
    /** The title of the milestone. */
    title: string
    /** The order index of the milestone. */
    orderIndex: number
    /** The tasks within this milestone. */
    tasks: Array<MilestoneTaskEntity>
}
