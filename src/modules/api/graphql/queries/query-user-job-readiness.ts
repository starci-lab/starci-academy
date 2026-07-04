import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryUserJobReadinessRequest, QueryUserJobReadinessResponse } from "./types/user-job-readiness"

const query1 = gql`
  query UserJobReadiness($userId: ID!) {
    userJobReadiness(userId: $userId) {
      success
      message
      error
      data {
        foundation {
          codingPercentile
          cvScore
        }
        tracks {
          courseId
          courseTitle
          courseSlug
          capstoneScore
          interviewScore
          cvScore
          depthScore
          band
          isQualified
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

/**
 * Fetches a user's job-readiness snapshot (global foundation + per-track depth
 * cards), by id. Mirrors `userJobReadiness`; payload at
 * `data.userJobReadiness.data` (null when nothing to show yet).
 */
export const queryUserJobReadiness = async ({
    query = QueryUserJobReadiness.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryUserJobReadiness, QueryUserJobReadinessRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
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
