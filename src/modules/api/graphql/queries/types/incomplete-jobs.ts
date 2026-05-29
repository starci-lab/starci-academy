import type { IncompleteJobsItem } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Payload of `incompletedJobs` when successful. */
export interface IncompleteJobsData {
    /** Array of incomplete background job summary rows. */
    items: Array<IncompleteJobsItem>
}

/** Apollo response shape for the `incompletedJobs` query. */
export interface QueryIncompleteJobsResponse {
    /** Top-level `incompletedJobs` field wrapping the standard API response. */
    incompletedJobs: GraphQLResponse<IncompleteJobsData>
}
