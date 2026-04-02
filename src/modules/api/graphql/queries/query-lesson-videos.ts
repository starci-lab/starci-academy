import type { LessonVideoEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `lessonVideos` list (`LessonVideosSortBy`). */
export enum LessonVideosSortBy {
    Title = "title",
    OrderIndex = "orderIndex",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryLessonVideosPayload {
    count: number
    data: Array<LessonVideoEntity>
}

const query1 = gql`
  query LessonVideos($request: LessonVideosRequest!) {
    lessonVideos(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          title
          description
          url
          durationMs
          orderIndex
          thumbnailUrl
        }
      }
    }
  }
`

export enum QueryLessonVideos {
    Query1 = "query1",
}

const queryMap: Record<QueryLessonVideos, DocumentNode> = {
    [QueryLessonVideos.Query1]: query1,
}

export type LessonVideosListFilters = PaginationFilters<LessonVideosSortBy>

export interface LessonVideosListRequest {
    moduleId: string
    filters: LessonVideosListFilters
}

export interface QueryLessonVideosResponse {
    lessonVideos: GraphQLResponse<QueryLessonVideosPayload>
}

export const defaultLessonVideosListSorts: Array<SortInput<LessonVideosSortBy>> = [
    {
        by: LessonVideosSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated module lesson videos (`ref/queries/lesson-videos/lesson-videos`).
 */
export const queryLessonVideos = async ({
    query = QueryLessonVideos.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryLessonVideos, LessonVideosListRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryLessonVideosResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
