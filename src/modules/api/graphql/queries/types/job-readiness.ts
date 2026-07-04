import type { GraphQLResponse } from "../../types"

/** Coarse band for a composite job-readiness score. */
export type JobReadinessBand = "needsWork" | "building" | "jobReady"

/** One verified track (a course the learner has built AI-graded proof in). */
export interface JobReadinessTrackItem {
    /** Course title, for the badge label. */
    courseTitle: string
    /** Course URL slug (display id), so the badge links to the course. */
    courseSlug: string
    /** Capstone completion % (0–100) for this course — null when the course has no capstone tasks. */
    capstoneScore: number | null
    /** Average mock-interview overall score (0–100) for this course — null when no attempts. */
    interviewScore: number | null
    /** Domain competency depth (0–100): weighted(capstone, interview). */
    depthScore: number
}

/** Composite job-readiness portfolio for one learner. */
export interface JobReadinessData {
    /** 0–100 composite — strongest track leads + foundation blend + breadth bonus. */
    compositeScore: number
    /** Coarse readiness band. */
    band: JobReadinessBand
    /** Latest CV review score (0–100), global — null if no CV reviewed yet. */
    cvScore: number | null
    /** Challenge-strength percentile (0–100), global — null if no passed challenges. */
    challengeScore: number | null
    /** Verified tracks (one per paid enrollment), strongest depth first. */
    tracks: Array<JobReadinessTrackItem>
}

/** Apollo response shape for the `myJobReadiness` query (self). */
export interface QueryMyJobReadinessResponse {
    /** Top-level `myJobReadiness` field wrapping the standard API response. */
    myJobReadiness: GraphQLResponse<JobReadinessData>
}

/** Apollo response shape for the `userJobReadiness` query (public, by user id). */
export interface QueryUserJobReadinessResponse {
    /** Top-level `userJobReadiness` field wrapping the standard API response. */
    userJobReadiness: GraphQLResponse<JobReadinessData>
}
