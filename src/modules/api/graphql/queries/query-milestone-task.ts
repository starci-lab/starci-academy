import type { MilestoneTaskEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type QueryParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query MilestoneTask($request: TaskRequest!) {
    task(request: $request) {
      success
      message
      error
      data {
        id
        title
        description
        hint
        orderIndex
        criterias {
          id
          text
          hint
          score
          orderIndex
        }
      }
    }
  }
`

export enum QueryMilestoneTask {
    Query1 = "query1",
}

const queryMap: Record<QueryMilestoneTask, DocumentNode> = {
    [QueryMilestoneTask.Query1]: query1,
}

/** Request for the `task` GraphQL query (milestone task by id). */
export interface MilestoneTaskQueryRequest {
    /** Milestone task primary id. */
    id: string
}

export interface QueryMilestoneTaskResponse {
    task: GraphQLResponse<MilestoneTaskEntity>
}

export type QueryMilestoneTaskVariables = QueryVariables<MilestoneTaskQueryRequest>

export type QueryMilestoneTaskParams = QueryParams<
    QueryMilestoneTask,
    MilestoneTaskQueryRequest
>

/**
 * Fetches a single milestone task (criteria included) by id.
 * Mirrors backend `task` query.
 */
export const queryMilestoneTask = async ({
    query = QueryMilestoneTask.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryMilestoneTaskParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMilestoneTaskResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
