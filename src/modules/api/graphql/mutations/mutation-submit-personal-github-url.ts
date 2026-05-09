import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SubmitPersonalGithubUrl($request: SubmitPersonalGithubUrlRequest!) {
    submitPersonalGithubUrl(request: $request) {
      success
      message
      error
      data {
        id
        personalProjectGithubUrl
      }
    }
  }
`

export enum MutationSubmitPersonalGithubUrl {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitPersonalGithubUrl, DocumentNode> = {
    [MutationSubmitPersonalGithubUrl.Mutation1]: mutation1,
}

/** GraphQL `SubmitPersonalGithubUrlRequest` body. */
export interface SubmitPersonalGithubUrlRequest {
    courseId: string
    githubUrl: string
}

/** Minimal payload needed on FE after successful GitHub URL submission. */
export interface SubmitPersonalGithubUrlData {
    id: string
    personalProjectGithubUrl: string | null
}

export type MutateSubmitPersonalGithubUrlVariables =
    QueryVariables<SubmitPersonalGithubUrlRequest>

export type MutateSubmitPersonalGithubUrlParams = MutateParams<
    MutationSubmitPersonalGithubUrl,
    SubmitPersonalGithubUrlRequest
>

export interface MutateSubmitPersonalGithubUrlResponse {
    submitPersonalGithubUrl: GraphQLResponse<SubmitPersonalGithubUrlData>
}

/**
 * Saves personal project GitHub URL for a specific enrollment.
 */
export const mutateSubmitPersonalGithubUrl = async ({
    mutation = MutationSubmitPersonalGithubUrl.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSubmitPersonalGithubUrlParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSubmitPersonalGithubUrlResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
