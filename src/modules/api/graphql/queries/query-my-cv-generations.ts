import { createAuthApolloClient } from "../clients"
import {
    SortOrder,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    MyCvGenerationsListRequest,
    QueryMyCvGenerationsResponse,
} from "./types/cv-generation"

/** Sort keys for `myCvGenerations`. */
export enum MyCvGenerationsSortBy {
    CreatedAt = "createdAt",
}

const query1 = gql`
  query MyCvGenerations($request: MyCvGenerationsRequest) {
    myCvGenerations(request: $request) {
      success
      message
      error
      data {
        totalCount
        data {
          id
          kind
          status
          latexSource
          extraPrompts
          error
          cvSubmissionId
          createdAt
        }
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

export const defaultMyCvGenerationsSorts: Array<SortInput<MyCvGenerationsSortBy>> = [
    {
        by: MyCvGenerationsSortBy.CreatedAt,
        order: SortOrder.Desc,
    },
]

/**
 * Paginated AI CV generations for the signed-in user (newest first).
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
