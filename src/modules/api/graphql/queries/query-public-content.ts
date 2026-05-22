import type { ContentEntity } from "@/modules/types"
import { createNoAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query PublicContent($request: PublicContentRequest!) {
    publicContent(request: $request) {
      success
      message
      error
      data {
        id
        displayId
        description
        orderIndex
        minutesRead
        isPremium
        title
        body
        challenges {
          id
        }
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

export enum QueryPublicContent {
    Query1 = "query1",
}

const queryMap: Record<QueryPublicContent, DocumentNode> = {
    [QueryPublicContent.Query1]: query1,
}

export interface QueryPublicContentResponse {
    publicContent: GraphQLResponse<ContentEntity>
}

export interface PublicContentRequest {
    /** The display id. */
    displayId?: string
    /** The id. */
    id?: string
}

/**
 * Fetch a single non-premium content row (no auth required).
 */
export const queryPublicContent = async ({
    query = QueryPublicContent.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryPublicContent, PublicContentRequest>) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryPublicContentResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
