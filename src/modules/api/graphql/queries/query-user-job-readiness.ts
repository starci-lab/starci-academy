import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryUserJobReadinessResponse } from "./types/job-readiness"

const query1 = gql`
  query UserJobReadiness($userId: ID!) {
    userJobReadiness(userId: $userId) {
      success
      message
      error
      data {
        compositeScore
        band
        cvScore
        challengeScore
        tracks {
          courseTitle
          courseSlug
          capstoneScore
          interviewScore
          depthScore
        }
      }
    }
  }
`

export enum QueryUserJobReadiness {
    Query1 = "query1",
}

const queryMap: Record<QueryUserJobReadiness, DocumentNode> = {
    [QueryUserJobReadiness.Query1]: query1,
}

/** Request body for the user-job-readiness query. */
export interface UserJobReadinessRequest {
    /** Id of the user whose job-readiness portfolio to fetch. */
    userId: string
}

/**
 * Fetches a user's PUBLIC job-readiness portfolio by user id — the
 * recruiter-facing view (also used for one's own profile, since profiles are
 * addressed by user id). Mirrors backend `queries/users/job-readiness`
 * (`userJobReadiness`).
 */
export const queryUserJobReadiness = async ({
    query = QueryUserJobReadiness.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryUserJobReadiness, UserJobReadinessRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryUserJobReadinessResponse>({
        query: queryMap[query],
        variables: {
            userId: request?.userId,
        },
    })
}
