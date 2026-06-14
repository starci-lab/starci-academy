import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyDashboardResponse } from "./types"

const query1 = gql`
  query MyDashboard {
    myDashboard {
      success
      message
      error
      data {
        enrolledCourses {
          globalId
          label
        }
        learnedLessons {
          globalId
          label
        }
        inProgressChallenges {
          globalId
          label
        }
      }
    }
  }
`

export enum QueryMyDashboard {
    Query1 = "query1",
}

const queryMap: Record<QueryMyDashboard, DocumentNode> = {
    [QueryMyDashboard.Query1]: query1,
}

/**
 * Fetches the GitHub-style home payload — the viewer's read-lesson history
 * (left rail) plus a feed of followed users' activity, in one round-trip.
 *
 * Mirrors `myDashboard` (queries/dashboard/my-dashboard/my-dashboard.resolver.ts).
 */
export const queryMyDashboard = async ({
    query = QueryMyDashboard.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryMyDashboard, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyDashboardResponse>({
        query: queryMap[query],
    })
}
