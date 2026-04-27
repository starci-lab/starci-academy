import type { LessonVideoEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import { withAbortContext, type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query LessonVideo($request: LessonVideoRequest!) {
    lessonVideo(request: $request) {
      success
      message
      error
      data {
        id
        createdAt
        updatedAt
        displayId
        title
        description
        kind
        caption
        hostPlatform
        url
        thumbnailUrl
        durationMs
        orderIndex
      }
    }
  }
`

export enum QueryLessonVideo {
    Query1 = "query1",
}

const queryMap: Record<QueryLessonVideo, DocumentNode> = {
    [QueryLessonVideo.Query1]: query1,
}

export interface QueryLessonVideoResponse {
    lessonVideo: GraphQLResponse<LessonVideoEntity>
}

export interface LessonVideoRequest {
    id: string
}

/**
 * One lesson video by id (`ref/queries/lesson-videos`).
 */
export const queryLessonVideo = async ({
    query = QueryLessonVideo.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryLessonVideo, LessonVideoRequest>) => {
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
    })

    return apollo.query<QueryLessonVideoResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
        ...withAbortContext(signal),
    })
}
