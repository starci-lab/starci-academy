import type { FoundationEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import type {
    PaginationFilters,
    QueryParams,
    SortInput,
} from "../types"
import { SortOrder } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `foundations` list (`FoundationsSortBy` on the API). */
export enum FoundationsSortBy {
    Title = "title",
    OrderIndex = "orderIndex",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

/** Paginated payload inside `foundations.data`. */
export interface QueryFoundationsPayload {
    count: number
    data: Array<FoundationEntity>
}

const query1 = gql`
  query Foundations($request: FoundationsRequest!) {
    foundations(request: $request) {
      data {
        count
        data {
          id
          displayId
          title
          description
          kind
          value
          orderIndex
          isRecommended
          author
          thumbnailUrl
          categoryId
          tags {
            id
            value
            orderIndex
          }
        }
      }
    }
  }
`

export enum QueryFoundations {
    Query1 = "query1",
}

const queryMap: Record<QueryFoundations, DocumentNode> = {
    [QueryFoundations.Query1]: query1,
}

export type FoundationsListFilters = PaginationFilters<FoundationsSortBy>

export interface FoundationsListRequest {
    categoryId: string
    filters?: FoundationsListFilters
}

export interface QueryFoundationsResponse {
    foundations: {
        data: QueryFoundationsPayload
    }
}

/** Default sort order for foundations list (`orderIndex` asc). */
export const defaultFoundationsListSorts: Array<SortInput<FoundationsSortBy>> = [
    {
        by: FoundationsSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/** Default page size for foundations list. */
export const defaultFoundationsListLimit = 100

/**
 * Paginated foundations for a category (`foundations` query).
 */
export const queryFoundations = async ({
    query = QueryFoundations.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryFoundations, FoundationsListRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryFoundationsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
