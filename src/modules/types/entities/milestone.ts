import type { PersonalProjectTaskType } from "../enums"
import type { AbstractEntity } from "./abstract"

/**
 * A pass criterion for a milestone task.
 */
export interface MilestoneTaskCriteriaEntity extends AbstractEntity {
    /** Criterion text. */
    text: string
    /** Criterion hint. */
    hint: string
    /** Prompt text for AI grading. */
    promptText: string
    /** Display order within the task criteria list. */
    orderIndex: number
    /** Score awarded when this criterion passes. */
    score: number
    /** Parent milestone task ID. */
    milestoneTaskId: string
}

/**
 * A task belonging to a milestone.
 */
export interface MilestoneTaskEntity extends AbstractEntity {
    /** Task title. */
    title: string
    /** Task description. */
    description: string
    /** Task hint. */
    hint: string
    /** Display order within the milestone's task list. */
    orderIndex: number
    /** Priority weight — lower values are higher priority. */
    weight: number
    /** Task type classification. */
    type: PersonalProjectTaskType
    /** Maximum possible score for this task. */
    maxScore: number
    /** Parent milestone ID. */
    milestoneId: string
    /** Criteria belonging to this task. */
    criterias?: Array<MilestoneTaskCriteriaEntity>
}

/**
 * A milestone belonging to a course.
 */
export interface MilestoneEntity extends AbstractEntity {
    /** Milestone title. */
    title: string
    /** Milestone description. */
    description: string
    /** Display order within the course's milestone list. */
    orderIndex: number
    /** Parent course ID. */
    courseId: string
    /** Tasks belonging to this milestone. */
    tasks?: Array<MilestoneTaskEntity>
}
