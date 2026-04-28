import { createNoAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { JobStatus } from "@/modules/types"

/**
 * One row in `data.items` (`jobs.id` + current status).
 */
export interface IncompleteChallengeSubmissionJobsItem {
    jobId: string
    status: JobStatus
}

/**
 * Payload of `incompleteChallengeSubmissionJobs` when successful.
 */
export interface IncompleteChallengeSubmissionJobsData {
    items: Array<IncompleteChallengeSubmissionJobsItem>
}

const query1 = gql`
  query IncompleteChallengeSubmissionJobs {
    incompleteChallengeSubmissionJobs {
      success
      message
      error
      data {
        items {
          jobId
          status
        }
      }
    }
  }
`

export enum QueryIncompleteChallengeSubmissionJobs {
    Query1 = "query1",
}

const queryMap: Record<QueryIncompleteChallengeSubmissionJobs, DocumentNode> = {
    [QueryIncompleteChallengeSubmissionJobs.Query1]: query1,
}

export interface QueryIncompleteChallengeSubmissionJobsResponse {
    incompleteChallengeSubmissionJobs: GraphQLResponse<IncompleteChallengeSubmissionJobsData>
}

/**
 * Incomplete challenge submission jobs for the current course context.
 * No GraphQL variables — filters come from auth + `X-Course-Id`.
 */
export const queryIncompleteChallengeSubmissionJobs = async ({
    query = QueryIncompleteChallengeSubmissionJobs.Query1,
    headers,
    debug,
    signal,
}: QueryParams<QueryIncompleteChallengeSubmissionJobs, undefined>) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryIncompleteChallengeSubmissionJobsResponse>({
        query: queryMap[query],
    })
}
