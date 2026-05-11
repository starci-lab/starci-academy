import type { AbstractEntity } from "./abstract"

export interface MilestoneTaskCriteriaEntity extends AbstractEntity {
    text: string
    hint?: string
    score: number
    orderIndex: number
    milestoneTaskId: string
}

export interface MilestoneTaskEntity extends AbstractEntity {
    title?: string
    description?: string
    hint?: string
    orderIndex: number
    criterias?: Array<MilestoneTaskCriteriaEntity>
}

export interface MilestoneEntity extends AbstractEntity {
    title?: string
    orderIndex: number
    courseId: string
    tasks: Array<MilestoneTaskEntity>
}
