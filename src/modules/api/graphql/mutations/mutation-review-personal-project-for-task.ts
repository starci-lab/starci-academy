import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation ReviewPersonalProjectTask($request: ReviewPersonalProjectTaskRequest!) {
    reviewPersonalProjectTask(request: $request) {
      success
      message
      error
      data {
        jobId
      }
    }
  }
`

export enum MutationReviewPersonalProjectTask {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationReviewPersonalProjectTask, DocumentNode> = {
    [MutationReviewPersonalProjectTask.Mutation1]: mutation1,
}

/** GraphQL `ReviewPersonalProjectTaskRequest` body. */
export interface ReviewPersonalProjectTaskRequest {
    /** Course ID. */
    courseId: string
    /** Task ID to review (defaults to first task if omitted). */
    taskId?: string
    /** GitHub repository URL. */
    githubUrl: string
    /** Branch name (defaults to main). */
    branch?: string
}

export interface ReviewPersonalProjectTaskData {
    attemptId: string
    jobId: string
}

export type MutateReviewPersonalProjectTaskVariables =
    QueryVariables<ReviewPersonalProjectTaskRequest>

export type MutateReviewPersonalProjectTaskParams = MutateParams<
    MutationReviewPersonalProjectTask,
    ReviewPersonalProjectTaskRequest
>

export interface MutateReviewPersonalProjectTaskResponse {
    reviewPersonalProjectTask: GraphQLResponse<ReviewPersonalProjectTaskData>
}

/**
 * Queues AI review for a personal project repository of one task.
 */
export const mutateReviewPersonalProjectTask = async ({
    mutation = MutationReviewPersonalProjectTask.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateReviewPersonalProjectTaskParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateReviewPersonalProjectTaskResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
