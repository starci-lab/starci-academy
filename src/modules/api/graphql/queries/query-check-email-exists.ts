import { createApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams, type QueryVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Request body for `checkEmailExists` (mirrors GraphQL `CheckEmailExistsRequest`). */
export interface CheckEmailExistsRequest {
    /** Email to probe against the bloom filter. */
    email: string
}

/** Data returned when the bloom filter answers (see backend `CheckEmailExistsData`). */
export interface CheckEmailExistsData {
    /**
     * True when the filter may contain this email; false means it is definitely absent
     * (no false negatives; false positives are possible when true).
     */
    exists: boolean
    /** False until the server-side filter is warmed in cache. */
    isBloomFilterReady: boolean
}

const query1 = gql`
  query CheckEmailExists($request: CheckEmailExistsRequest!) {
    checkEmailExists(request: $request) {
      success
      message
      error
      data {
        exists
        isBloomFilterReady
      }
    }
  }
`

export enum QueryCheckEmailExists {
    Query1 = "query1",
}

const queryMap: Record<QueryCheckEmailExists, DocumentNode> = {
    [QueryCheckEmailExists.Query1]: query1,
}

export interface QueryCheckEmailExistsResponse {
    checkEmailExists: GraphQLResponse<CheckEmailExistsData>
}

/**
 * Public check: does not require an access token (sign-up / sign-in forms).
 * @param params - GraphQL document key, `request.email`, and optional `debug`
 */
export const queryCheckEmailExists = async ({
    query = QueryCheckEmailExists.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryCheckEmailExists, CheckEmailExistsRequest>) => {
    if (!request) {
        throw new Error("queryCheckEmailExists requires `request`")
    }
    const apollo = createApolloClient(
        {
            cache: false,
            debug,
            signal,
        },
    )
    return apollo.query<
        QueryCheckEmailExistsResponse,
        QueryVariables<CheckEmailExistsRequest>
    >(
        {
            query: queryMap[query],
            variables: { request },
        },
    )
}
