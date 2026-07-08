import type { GraphQLResponse } from "../../types"

/**
 * One passed capstone/milestone task attempt the learner can pick into a CV
 * "Dự án" block. Existence of this row is the Verified trust signal — mirrors
 * the BE `PickableMilestoneAchievement` GraphQL type.
 *
 * CAPSTONE ONLY: challenges and StarCi "achievements" (leaderboard/coding/
 * badges) deliberately never reach the CV — only a real passed capstone does.
 */
export interface PickableMilestoneAchievement {
    /** `user_milestone_task_attempts.id` — stable key for the pick-list. */
    id: string
    /** The capstone task title. */
    taskTitle: string
    /** The milestone this task belongs to. */
    milestoneTitle: string
    /** The course this capstone belongs to. */
    courseTitle: string
    /** The attempt's score. */
    score: number
}

/**
 * The signed-in user's pickable StarCi capstone projects — the "pick from
 * StarCi" data source for the CV block editor.
 */
export interface MyPickableCvAchievementsPayload {
    /** Passed capstone/milestone task attempts, most recent first. */
    milestoneTaskAttempts: Array<PickableMilestoneAchievement>
}

/** Response envelope for the `myPickableCvAchievements` query. */
export interface QueryMyPickableCvAchievementsResponse {
    /** Query root field. */
    myPickableCvAchievements: GraphQLResponse<MyPickableCvAchievementsPayload | null>
}
