import type { GraphQLResponse } from "../../types"
import type { UserEntity } from "@/modules/types/entities/user"
import type { UserJobReadinessTrack } from "./user-job-readiness"

/** Variables for the `talentCandidates` query. */
export interface QueryTalentCandidatesRequest {
    /**
     * The track to filter + rank on — the `courseId` of a job-readiness track.
     * Ranking is scoped to THIS course's depth only (never a cross-track blend).
     */
    courseId: string
    /** Max candidates per page. */
    limit?: number
    /** Rows to skip (offset pagination). */
    offset?: number
}

/**
 * One ranked candidate on the recruiter marketplace — the open-to-work user plus
 * their readiness card for the ONE filtered track. `track` is the same shape a
 * profile shows ({@link UserJobReadinessTrack}) so the FE renders the same
 * qualitative `band` / `isQualified` badges, never a raw cross-track composite.
 */
export interface TalentCandidateItem {
    /** The open-to-work candidate — public header fields render the card. */
    user: UserEntity
    /** The candidate's readiness card for the filtered track ONLY. */
    track: UserJobReadinessTrack
}

/** Apollo response shape for the `talentCandidates` query. */
export interface QueryTalentCandidatesResponse {
    /** Top-level `talentCandidates` field wrapping the standard API response. */
    talentCandidates: GraphQLResponse<Array<TalentCandidateItem> | null>
}
