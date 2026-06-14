import type { GraphQLResponse } from "../../types"

/**
 * Kind of in-app activity in the home feed (mirrors backend `ActivityType`).
 */
export enum ActivityType {
    /** Read a lesson for the first time. */
    LessonRead = "lessonRead",
    /** Bookmarked a lesson. */
    LessonBookmarked = "lessonBookmarked",
    /** Passed a challenge. */
    ChallengePassed = "challengePassed",
    /** Solved a coding problem. */
    CodingSolved = "codingSolved",
    /** Passed a milestone task. */
    MilestonePassed = "milestonePassed",
    /** Passed an AI Lab eval challenge. */
    AiLabPassed = "aiLabPassed",
    /** Enrolled in a course. */
    CourseEnrolled = "courseEnrolled",
    /** Posted a discussion comment. */
    DiscussionCommented = "discussionCommented",
    /** Started following another user. */
    UserFollowed = "userFollowed",
}

/** A clickable left-rail item (course / lesson / challenge) — token-based. */
export interface QueryMyDashboardRefItemData {
    /** Opaque global id — pass to resolveRoute on click. */
    globalId: string
    /** Token label (course / lesson / challenge title). */
    label: string
}

/** One activity item in the home feed (token-based). */
export interface QueryMyDashboardFeedItemData {
    /** Opaque global id of the actor (a user) — pass to resolveRoute on click. */
    actorGlobalId: string
    /** Actor username (the actor token label). */
    actorUsername: string
    /** Avatar URL of the actor, or null when unset. */
    actorAvatar: string | null
    /** Kind of activity (drives the feed phrasing). */
    type: ActivityType
    /** Opaque global id of the target entity — pass to resolveRoute on click. */
    targetGlobalId: string | null
    /** Target token label (lesson/challenge/course title, or username). */
    targetLabel: string | null
    /** When the activity happened (ISO string). */
    at: string
}

/** Payload inside `myDashboard.data` after the standard API wrapper. */
export interface QueryMyDashboardResponseData {
    /** Courses the viewer has joined (left rail). */
    enrolledCourses: Array<QueryMyDashboardRefItemData>
    /** Lessons the viewer recently read (left rail). */
    learnedLessons: Array<QueryMyDashboardRefItemData>
    /** Challenges the viewer has started but not yet passed (left rail). */
    inProgressChallenges: Array<QueryMyDashboardRefItemData>
}

/** Apollo response shape for the `myDashboard` query. */
export interface QueryMyDashboardResponse {
    /** Top-level `myDashboard` field wrapping the standard API response. */
    myDashboard: GraphQLResponse<QueryMyDashboardResponseData>
}
