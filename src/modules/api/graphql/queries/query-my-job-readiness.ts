import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyJobReadinessResponse } from "./types/user-job-readiness"

const query1 = gql`
  query MyJobReadiness {
    myJobReadiness {
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

export enum QueryMyJobReadiness {
    Query1 = "query1",
}

const queryMap: Record<QueryMyJobReadiness, DocumentNode> = {
    [QueryMyJobReadiness.Query1]: query1,
}

/**
 * Fetches the authenticated viewer's own job-readiness snapshot (global
 * foundation + per-track depth cards) — the self-scoped sibling of
 * `queryUserJobReadiness`, with no `userId` argument.
 */
export const queryMyJobReadiness = async ({
    query = QueryMyJobReadiness.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryMyJobReadiness, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyJobReadinessResponse>({
        query: queryMap[query],
    })
}
