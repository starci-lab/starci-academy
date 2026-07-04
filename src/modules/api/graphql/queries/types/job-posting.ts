import type { GraphQLResponse } from "../../types"
import type { JobPostingEntity } from "@/modules/types/entities/job-posting"

/** Apollo response shape for the `jobPosting` query. */
export interface QueryJobPostingResponse {
    /** Top-level `jobPosting` field wrapping the standard API response. */
    jobPosting: GraphQLResponse<JobPostingEntity>
}
