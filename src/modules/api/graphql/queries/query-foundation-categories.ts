import { createAuthApolloClient } from "../clients"
import type { QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryFoundationCategoriesResponse } from "./types"

const query1 = gql`
  query FoundationCategories {
    foundationCategories {
      success
      message
      error
      data {
        id
        displayId
        title
        description
        slug
        thumbnailUrl
        orderIndex
      }
    }
  }
`

export enum QueryFoundationCategories {
    Query1 = "query1",
}

const queryMap: Record<QueryFoundationCategories, DocumentNode> = {
    [QueryFoundationCategories.Query1]: query1,
}

export const queryFoundationCategories = async ({
    query = QueryFoundationCategories.Query1,
    debug,
    headers,
    signal,
}: QueryParams<QueryFoundationCategories>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryFoundationCategoriesResponse>({
        query: queryMap[query],
    })
}
