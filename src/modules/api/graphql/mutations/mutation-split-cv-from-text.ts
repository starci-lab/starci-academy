import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { SplitCvFromTextRequest, MutateSplitCvFromTextResponse } from "./types/split-cv-from-text"

const mutation1 = gql`
  mutation SplitCvFromText($request: SplitCvFromTextRequest!) {
    splitCvFromText(request: $request) {
      success
      message
      error
      data {
        blocks
      }
    }
  }
`

export enum MutationSplitCvFromText {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSplitCvFromText, DocumentNode> = {
    [MutationSplitCvFromText.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSplitCvFromText}. */
export type MutateSplitCvFromTextParams = MutateParams<
    MutationSplitCvFromText,
    SplitCvFromTextRequest
>

/**
 * AI-parses a pasted CV text into structured blocks (ingest path — NOT
 * persisted). The caller loads the returned blocks straight into the editor,
 * then autosaves them via `updateCvBlocks` like any other edit.
 */
export const mutateSplitCvFromText = async ({
    mutation = MutationSplitCvFromText.Mutation1,
    request,
    debug,
    signal,
}: MutateSplitCvFromTextParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateSplitCvFromTextResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
