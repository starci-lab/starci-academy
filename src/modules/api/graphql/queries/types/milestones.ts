import type { MilestoneEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo variables for `milestones(request: MilestonesRequest!)`. */
export interface QueryMilestonesRequest {
    /** The course id whose milestones should be listed. */
    courseId: string
}

/** Payload inside `milestones.data` wrapping the array of milestone rows. */
export interface QueryMilestonesResponseData {
    /** Array of milestone entity rows for the course. */
    data: Array<MilestoneEntity>
}

/** Apollo response shape for the `milestones` query. */
export interface QueryMilestonesResponse {
    /** Top-level `milestones` field wrapping the standard API response. */
    milestones: GraphQLResponse<QueryMilestonesResponseData>
}
