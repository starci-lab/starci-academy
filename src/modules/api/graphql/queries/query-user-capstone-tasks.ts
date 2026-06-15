import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryUserCapstoneTasksRequest, QueryUserCapstoneTasksResponse } from "./types"

const query1 = gql`
  query UserCapstoneTasks($userId: ID!) {
    userCapstoneTasks(userId: $userId) {
      success
      message
      error
      data {
        courseGlobalId
        courseTitle
        milestoneTitle
        taskTitle
        score
        passedAt
      }
    }
  }
`

export enum QueryUserCapstoneTasks {
    Query1 = "query1",
}

const queryMap: Record<QueryUserCapstoneTasks, DocumentNode> = {
    [QueryUserCapstoneTasks.Query1]: query1,
}

/**
 * Fetches a user's passed capstone (milestone) tasks by id. Mirrors
 * `userCapstoneTasks` (queries/users/user-capstone-tasks); list at
 * `data.userCapstoneTasks.data`.
 */
export const queryUserCapstoneTasks = async ({
    query = QueryUserCapstoneTasks.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryUserCapstoneTasks, QueryUserCapstoneTasksRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryUserCapstoneTasksResponse>({
        query: queryMap[query],
        variables: {
            userId: request?.userId,
        },
    })
}
