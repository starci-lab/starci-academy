import type { GraphQLResponse } from "../../types"
import type { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import type { WorkMode } from "@/modules/types/enums/work-mode"
import type { JobPostingEntity } from "@/modules/types/entities/job-posting"

/** Apollo variables for `jobPostings(request: JobPostingsRequest!)`. */
export interface JobPostingsRequest {
    /** Page size (server clamps to 100). Defaults to 20. */
    limit?: number
    /** Rows to skip (offset pagination). Defaults to 0. */
    offset?: number
    /** Optional work-mode filter. */
    workMode?: WorkMode
    /** Optional employment-type filter. */
    employmentType?: JobEmploymentType
    /** Optional case-insensitive search on the title. */
    search?: string
}

/** Paginated payload inside `jobPostings.data`. */
export interface JobPostingsPayload {
    /** Page of job postings (newest first), each with `company` eager-loaded. */
    items: Array<JobPostingEntity>
    /** Total number of postings matching the filter. */
    total: number
}

/** Apollo response shape for the `jobPostings` query. */
export interface QueryJobPostingsResponse {
    /** Top-level `jobPostings` field wrapping the standard API response. */
    jobPostings: GraphQLResponse<JobPostingsPayload>
}
