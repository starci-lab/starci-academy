import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { AcceptAnswerRequest, MutateAcceptAnswerResponse } from "./types"

const mutation1 = gql`
  mutation AcceptAnswer($request: AcceptAnswerRequest!) {
    acceptAnswer(request: $request) {
      success
      message
      error
    }
  }
`

/** Variant selector for {@link mutateAcceptAnswer}. */
export enum MutationAcceptAnswer {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationAcceptAnswer, DocumentNode> = {
    [MutationAcceptAnswer.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateAcceptAnswer}. */
export type MutateAcceptAnswerParams = MutateParams<MutationAcceptAnswer, AcceptAnswerRequest>

/** Accepts (or clears) a reply as the accepted answer to its question. */
export const mutateAcceptAnswer = async ({
    mutation = MutationAcceptAnswer.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateAcceptAnswerParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.mutate<MutateAcceptAnswerResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
