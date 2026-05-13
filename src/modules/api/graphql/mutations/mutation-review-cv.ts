import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation ReviewCv($request: ReviewCvRequest!) {
    reviewCv(request: $request) {
      success
      message
      error
      data {
        jobId
      }
    }
  }
`

export enum MutationReviewCv {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationReviewCv, DocumentNode> = {
    [MutationReviewCv.Mutation1]: mutation1,
}

export interface ReviewCvRequest {
    cvSubmissionId: string
    cvSubmissionAttemptId?: string
    /** Required rubric level (`template_cvs.id`). */
    templateCvId: string
}

export interface ReviewCvResponseData {
    /** `jobs.id` enqueued for CV review. */
    jobId: string
}

export type MutateReviewCvVariables = QueryVariables<ReviewCvRequest>

export type MutateReviewCvParams = MutateParams<
    MutationReviewCv,
    ReviewCvRequest
>

export interface MutateReviewCvResponse {
    reviewCv: GraphQLResponse<ReviewCvResponseData>
}

export const mutateReviewCv = async ({
    mutation = MutationReviewCv.Mutation1,
    request,
    debug,
    signal,
    headers,
}: MutateReviewCvParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.mutate<MutateReviewCvResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
