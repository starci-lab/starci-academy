import type { ContentEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type {
    GraphQLResponse,
    PaginationFilters,
    QueryParams,
    SortInput,
} from "../types"
import { SortOrder } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `contents` list (`ContentsSortBy` on the API). */
export enum ContentsSortBy {
    Title = "title",
    OrderIndex = "orderIndex",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

/** Paginated payload inside `contents.data`. */
export interface QueryContentsPayload {
    count: number
    data: Array<ContentEntity>
}

const query1 = gql`
  query Contents($request: ContentsRequest!) {
    contents(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
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
          }
        }
      }
    }
  }
`

export enum QueryContents {
    Query1 = "query1",
}

const queryMap: Record<QueryContents, DocumentNode> = {
    [QueryContents.Query1]: query1,
}

export type ContentsListFilters = PaginationFilters<ContentsSortBy> & {
    moduleId: string
}

export interface ContentsListRequest {
    filters: ContentsListFilters
}

export interface QueryContentsResponse {
    contents: GraphQLResponse<QueryContentsPayload>
}

/** Default sort order for module contents list (`orderIndex` asc). */
export const defaultContentsListSorts: Array<SortInput<ContentsSortBy>> = [
    {
        by: ContentsSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/** Default page size for module-scoped list queries. */
export const defaultModuleListLimit = 100

/**
 * Paginated module contents (`ref/queries/contents/contents`).
 */
export const queryContents = async ({
    query = QueryContents.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryContents, ContentsListRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryContentsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
