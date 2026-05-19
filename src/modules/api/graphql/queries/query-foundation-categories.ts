import type { FoundationCategoryEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

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

export interface QueryFoundationCategoriesResponse {
    foundationCategories: GraphQLResponse<Array<FoundationCategoryEntity>>
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
