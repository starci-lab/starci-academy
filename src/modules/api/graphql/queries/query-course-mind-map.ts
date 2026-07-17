import { createNoAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    QueryCourseMindMapRequest,
    QueryCourseMindMapResponse,
} from "./types"

const query1 = gql`
  query CourseMindMap($request: CourseMindMapRequest!) {
    courseMindMap(request: $request) {
      success
      message
      error
      data {
        nodes {
          id
          type
          position {
            x
            y
          }
          data {
            label
            kind
            entityId
            moduleId
            displayId
            desc
            links {
              kind
              entityId
              moduleId
              displayId
            }
          }
        }
        edges {
          id
          source
          target
          type
          animated
        }
      }
    }
  }
`

/** Document variants for {@link queryCourseMindMap}. */
export enum QueryCourseMindMap {
    Query1 = "query1",
}

const queryMap: Record<QueryCourseMindMap, DocumentNode> = {
    [QueryCourseMindMap.Query1]: query1,
}

/**
 * Fetches the course mind-map graph (the AUTHORED concept tree when the course has one,
 * else the derived module graph) via Apollo.
 *
 * @param params - Document key, GraphQL variables
 * @returns Apollo query result; graph at `data.courseMindMap.data`
 */
export const queryCourseMindMap = async ({
    query = QueryCourseMindMap.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryCourseMindMap, QueryCourseMindMapRequest>) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryCourseMindMapResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
