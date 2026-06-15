import type { GraphQLResponse } from "../../types"

/** Variables for the `userCapstoneTasks` query. */
export interface QueryUserCapstoneTasksRequest {
    /** Id of the user whose passed capstone tasks to fetch. */
    userId: string
}

/** One passed capstone (milestone) task on a user's profile. */
export interface QueryUserCapstoneTaskItemData {
    /** Opaque global id of the course — pass to resolveRoute on click. */
    courseGlobalId: string
    /** Course title. */
    courseTitle: string
    /** Milestone title the task belongs to. */
    milestoneTitle: string
    /** Milestone-task title. */
    taskTitle: string
    /** Score achieved on the passing attempt. */
    score: number
    /** When the task was passed (ISO), or null. */
    passedAt: string | null
}

/** Apollo response shape for the `userCapstoneTasks` query. */
export interface QueryUserCapstoneTasksResponse {
    /** Top-level `userCapstoneTasks` field wrapping the standard API response. */
    userCapstoneTasks: GraphQLResponse<Array<QueryUserCapstoneTaskItemData>>
}
