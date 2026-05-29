import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { SubmitQuizTestRequest, MutateSubmitQuizTestResponse } from "./types/submit-quiz-test"

const mutation1 = gql`
  mutation SubmitQuizTest($request: SubmitQuizTestRequest!) {
    submitQuizTest(request: $request) {
      success
      message
      error
      data {
        quizDeckId
        total
        correct
        scorePercent
        results {
          quizCardId
          selectedOptionId
          correctOptionId
          correct
        }
      }
    }
  }
`

export enum MutationSubmitQuizTest {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitQuizTest, DocumentNode> = {
    [MutationSubmitQuizTest.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSubmitQuizTest}. */
export type MutateSubmitQuizTestParams = MutateParams<MutationSubmitQuizTest, SubmitQuizTestRequest>

export const mutateSubmitQuizTest = async ({
    mutation = MutationSubmitQuizTest.Mutation1,
    request,
    debug,
    signal,
}: MutateSubmitQuizTestParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.mutate<MutateSubmitQuizTestResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
