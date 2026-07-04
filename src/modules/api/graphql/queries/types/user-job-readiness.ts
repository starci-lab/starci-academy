import type { GraphQLResponse } from "../../types"

/** Variables for the `userJobReadiness` query. */
export interface QueryUserJobReadinessRequest {
    /** Id of the user whose job-readiness snapshot to fetch. */
    userId: string
}

/** Band describing how close a track's depth score is to "job ready". */
export type UserJobReadinessBand = "needsWork" | "building" | "jobReady"

/**
 * Global, engagement-free signal — a percentile earned by activity anyone can
 * do (solving practice problems), never tied to a purchased course.
 */
export interface UserJobReadinessFoundation {
    /** Percent of ranked users the viewer beats on coding-practice strength (0–100), or null when unranked. */
    codingPercentile: number | null
    /** Best CV review score (0–100) across the user's CVs, or null when none reviewed. */
    cvScore: number | null
}

/** One purchased-course track: its own depth signal, never blended with other tracks. */
export interface UserJobReadinessTrack {
    /** Id of the course this track belongs to. */
    courseId: string
    /** Display title of the course (e.g. "Fullstack Mastery"). */
    courseTitle: string
    /** Slug used to link to the course detail page. */
    courseSlug: string
    /** Best capstone/personal-project score (0–100) for this track, or null when not attempted. */
    capstoneScore: number | null
    /** Best mock-interview score (0–100) for this track, or null when not attempted. */
    interviewScore: number | null
    /** Best CV review score (0–100) tied to this track's course, or null when no scored CV is attached to it. */
    cvScore: number | null
    /** The track's own depth score (0–100) — never blended across tracks. */
    depthScore: number | null
    /** Readiness band derived from {@link depthScore} against fixed thresholds. */
    band: UserJobReadinessBand
    /** Whether this track alone clears the "job ready" bar. */
    isQualified: boolean
}

/**
 * The job-readiness payload: a global foundation signal plus one card per
 * purchased course track — never a single blended composite (see
 * `.workflows/00-INDEX.md` fairness model).
 */
export interface QueryUserJobReadinessData {
    /** Engagement-free, course-independent signal. */
    foundation: UserJobReadinessFoundation
    /** One entry per track (purchased course), strongest `depthScore` first. */
    tracks: UserJobReadinessTrack[]
}

/** Apollo response shape for the `userJobReadiness` query. */
export interface QueryUserJobReadinessResponse {
    /** Top-level `userJobReadiness` field wrapping the standard API response. */
    userJobReadiness: GraphQLResponse<QueryUserJobReadinessData | null>
}

/**
 * Apollo response shape for the `myJobReadiness` query — the self-scoped
 * sibling of `userJobReadiness` (no `userId` argument; resolved from the
 * authenticated viewer). Shares the exact same payload shape
 * ({@link QueryUserJobReadinessData}) — single source for the `foundation` +
 * `tracks` snapshot regardless of which query fetched it.
 */
export interface QueryMyJobReadinessResponse {
    /** Top-level `myJobReadiness` field wrapping the standard API response. */
    myJobReadiness: GraphQLResponse<QueryUserJobReadinessData | null>
}
