import type { ContentEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Content($request: ContentRequest!) {
    content(request: $request) {
      success
      message
      error
      data {
        id
        displayId
        description
        orderIndex
        minutesRead
        title
        body
        numChallenges
        numLessons
        references {
          id
          alias
          url
          orderIndex
        }
      }
    }
  }
`

export enum QueryContent {
    Query1 = "query1",
}

const queryMap: Record<QueryContent, DocumentNode> = {
    [QueryContent.Query1]: query1,
}

export interface QueryContentResponse {
    content: GraphQLResponse<ContentEntity>
}

export interface ContentRequest {
    /** The display id. */
    displayId?: string
    /** The id. */
    id?: string

}

/**
 * One module content row by id (`ref/queries/contents`).
 */
export const queryContent = async ({
    query = QueryContent.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryContent, ContentRequest>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient({
        auth: hasAuth,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryContentResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
