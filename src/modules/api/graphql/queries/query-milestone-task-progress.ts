import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query MilestoneTaskProgress($request: MilestoneTaskProgressRequest!) {
    milestoneTaskProgress(request: $request) {
      success
      message
      error
      data {
        completionTasks {
          id
          lastScore
          maxScore
          completed
          numAttempts
        }
        currentTask {
          id
          lastScore
          maxScore
          completed
          numAttempts
        }
      }
    }
  }
`

export enum QueryMilestoneTaskProgress {
    Query1 = "query1",
}

const queryMap: Record<QueryMilestoneTaskProgress, DocumentNode> = {
    [QueryMilestoneTaskProgress.Query1]: query1,
}

export interface QueryMilestoneTaskProgressRequest {
    courseId: string
}

export interface MilestoneTaskProgressItem {
    id: string
    lastScore: number
    maxScore: number
    completed: boolean
    numAttempts: number
}

export interface QueryMilestoneTaskProgressResponseData {
    completionTasks: Array<MilestoneTaskProgressItem>
    currentTask: MilestoneTaskProgressItem | null
}

export interface QueryMilestoneTaskProgressResponse {
    milestoneTaskProgress: GraphQLResponse<QueryMilestoneTaskProgressResponseData>
}

export const queryMilestoneTaskProgress = async ({
    query = QueryMilestoneTaskProgress.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMilestoneTaskProgress, QueryMilestoneTaskProgressRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMilestoneTaskProgressResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
