import { createAuthApolloClient } from "../clients"
import { MutateParams } from "../types"
import { gql } from "@apollo/client"
import type { AskContentAiRequest, MutateAskContentAiResponse } from "./types/ask-content-ai"

const mutation = gql`
  mutation AskContentAi($request: AskContentAiRequest!) {
    askContentAi(request: $request) {
      success
      message
      error
      data {
        answer
      }
    }
  }
`

/** Apollo params for {@link mutateAskContentAi}. */
export type MutateAskContentAiParams = MutateParams<
    MutateAskContentAiResponse,
    AskContentAiRequest
>

/**
 * Asks the content-AI assistant a question for the grounded surface and returns
 * the answer payload. Mirrors backend `askContentAi`.
 */
export const mutateAskContentAi = async ({
    request,
    debug,
    headers,
    signal,
}: MutateAskContentAiParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        headers,
        signal,
    })
    const result = await apollo.mutate<MutateAskContentAiResponse>({
        mutation,
        variables: { request },
    })
    return result.data?.askContentAi
}
