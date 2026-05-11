
import type { PersonalProjectTaskEntity } from "@/modules/types"
import { PersonalProjectTaskState } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Tasks($request: TasksRequest!) {
    tasks(request: $request) {
      success
      message
      error
      data {
        data {
          id
          title
          description
          type
          state
          weight
          orderIndex
          maxScore
          passScore
          enrollmentId
          criteria {
            id
            text
            orderIndex
            score
          }
        }
        cursor
      }
    }
  }
`

export enum QueryTasks {
    Query1 = "query1",
}

const queryMap: Record<QueryTasks, DocumentNode> = {
    [QueryTasks.Query1]: query1,
}

/** Apollo variables for `tasks(request: TasksRequest!)`. */
export interface QueryTasksRequest {
    /** The course id. */
    courseId: string
    /** Filter by task state (todo, inProgress, completed). */
    state: PersonalProjectTaskState
    /** Pagination cursor filters. */
    filters: {
        /** Cursor for pagination. */
        cursor?: string
        /** Limit for pagination. */
        limit?: number
    }
}

/** Response shape for the tasks query (cursor-paginated). */
export interface QueryTasksResponseData {
    /** The list of tasks for the current page. */
    data: Array<PersonalProjectTaskEntity>
    /** The cursor for the next page. */
    cursor?: string
}

export interface QueryTasksResponse {
    tasks: GraphQLResponse<QueryTasksResponseData>
}

/**
 * Fetches personal project tasks for a course via Apollo.
 *
 * @param params - Document key, GraphQL variables
 * @returns Apollo query result; tasks at `data.tasks.data`
 */
export const queryTasks = async ({
    query = QueryTasks.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryTasks, QueryTasksRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryTasksResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
