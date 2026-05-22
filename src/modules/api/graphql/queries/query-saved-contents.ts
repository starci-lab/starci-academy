import type { ContentEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query SavedContents($request: SavedContentsRequest!) {
    savedContents(request: $request) {
      success
      message
      error
      data {
        contents {
          id
          displayId
          title
          description
          minutesRead
          isPremium
          challenges {
            id
          }
          numLessons
        }
        count
      }
    }
  }
`

export enum QuerySavedContents {
    Query1 = "query1",
}

const queryMap: Record<QuerySavedContents, DocumentNode> = {
    [QuerySavedContents.Query1]: query1,
}

export interface SavedContentsData {
    contents: ContentEntity[]
    count: number
}

export interface QuerySavedContentsResponse {
    savedContents: GraphQLResponse<SavedContentsData>
}

export interface SavedContentsRequest {
    skip?: number
    take?: number
}

export const querySavedContents = async ({
    query = QuerySavedContents.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QuerySavedContents, SavedContentsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QuerySavedContentsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
