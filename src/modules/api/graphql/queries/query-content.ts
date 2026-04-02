import type { ContentEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Content($request: ContentRequest!) {
    content(request: $request) {
      success
      message
      error
      data {
        id
        thumbnailUrl
        description
        orderIndex
        minutesRead
        title
        body
        references {
          id
          alias
          url
          orderIndex
          defaultLocale
          translations {
            id
            contentReferenceId
            locale
            field
            value
          }
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
    id: string
}

/**
 * One module content row by id (`ref/queries/contents`).
 */
export const queryContent = async ({
    query = QueryContent.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryContent, ContentRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryContentResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
