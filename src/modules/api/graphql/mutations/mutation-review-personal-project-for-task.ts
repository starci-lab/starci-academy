import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation ReviewPersonalProjectForTask($request: ReviewPersonalProjectForTaskRequest!) {
    reviewPersonalProjectForTask(request: $request) {
      success
      message
      error
      data {
        attemptId
        jobId
      }
    }
  }
`

export enum MutationReviewPersonalProjectForTask {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationReviewPersonalProjectForTask, DocumentNode> = {
    [MutationReviewPersonalProjectForTask.Mutation1]: mutation1,
}

/** GraphQL `ReviewPersonalProjectForTaskRequest` body. */
export interface ReviewPersonalProjectForTaskRequest {
    enrollmentMilestoneId: string
    githubUrl: string
    branch?: string
}

export interface ReviewPersonalProjectForTaskData {
    attemptId: string
    jobId: string
}

export type MutateReviewPersonalProjectForTaskVariables =
    QueryVariables<ReviewPersonalProjectForTaskRequest>

export type MutateReviewPersonalProjectForTaskParams = MutateParams<
    MutationReviewPersonalProjectForTask,
    ReviewPersonalProjectForTaskRequest
>

export interface MutateReviewPersonalProjectForTaskResponse {
    reviewPersonalProjectForTask: GraphQLResponse<ReviewPersonalProjectForTaskData>
}

/**
 * Queues AI review for a personal project repository of one milestone.
 */
export const mutateReviewPersonalProjectForTask = async ({
    mutation = MutationReviewPersonalProjectForTask.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateReviewPersonalProjectForTaskParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateReviewPersonalProjectForTaskResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
