import { createAuthApolloClient } from "../clients"
import {
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    MyCvGenerationsListRequest,
    QueryMyCvGenerationsResponse,
} from "./types/cv-generation"

const query1 = gql`
  query MyCvGenerations($request: MyCvGenerationsRequest) {
    myCvGenerations(request: $request) {
      success
      message
      error
      data {
        id
        mode
        status
        source
        score
        label
        courseId
        courseTitle
        targetRole
        language
        errorMessage
        processedAt
        createdAt
      }
    }
  }
`

export enum QueryMyCvGenerations {
    Query1 = "query1",
}

const queryMap: Record<QueryMyCvGenerations, DocumentNode> = {
    [QueryMyCvGenerations.Query1]: query1,
}

/**
 * AI CV generations for the signed-in user (newest first). Pagination via
 * `limit` / `offset`; the backend returns a flat array (clamped server-side).
 */
export const queryMyCvGenerations = async ({
    query = QueryMyCvGenerations.Query1,
    request,
    debug,
    signal,
    headers,
}: QueryParams<QueryMyCvGenerations, MyCvGenerationsListRequest | undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryMyCvGenerationsResponse>({
        query: queryMap[query],
        variables: {
            request: request ?? {},
        },
        fetchPolicy: "no-cache",
    })
}
