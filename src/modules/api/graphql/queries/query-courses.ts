import { createAuthApolloClient } from "../clients"
import {
    SortBy,
    SortOrder,
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryCoursesRequest, QueryCoursesResponse } from "./types"

const query1 = gql`
  query Courses($request: CoursesRequest!) {
    courses(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          displayId
          title
          slug
          description
          cdnUrl
          coverImageUrl
          originalPrice
          originalPriceUsd
          currentPhase
          enrollmentCount
          isEnrolled
          pricingPhases {
            phase
            price
            priceUsd
          }
          valuePropositions {
            text
          }
        }
      }
    }
  }
`

export enum QueryCourses {
    Query1 = "query1",
}

const queryMap: Record<QueryCourses, DocumentNode> = {
    [QueryCourses.Query1]: query1,
}

/** Default list sort (title A→Z). */
export const defaultCoursesSorts = [
    {
        by: SortBy.Title,
        order: SortOrder.Asc,
    },
] as const

/**
 * Fetches a paginated course list via Apollo.
 *
 * Uses the authenticated client (optional-auth on the BE resolver): a signed-in
 * viewer's bearer token is attached when present so each row's `isEnrolled` reflects
 * their real enrollment; a guest sends no token and every row comes back with
 * `isEnrolled: null` — same anonymous behavior as before.
 *
 * @param params - Document key, GraphQL variables, optional bearer token
 * @returns Rows at `data.courses.data.data`, total at `data.courses.data.count`
 */
export const queryCourses = async ({
    query = QueryCourses.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryCourses, QueryCoursesRequest>) => {
    const apollo = createAuthApolloClient(
        {
            cache: false,
            debug,
            signal,
        }
    )
    return apollo.query<QueryCoursesResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
