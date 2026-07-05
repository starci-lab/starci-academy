import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { ExtractDocumentTextRequest, MutateExtractDocumentTextResponse } from "./types/extract-document-text"

const mutation1 = gql`
  mutation ExtractDocumentText($request: ExtractDocumentTextRequest!) {
    extractDocumentText(request: $request) {
      success
      message
      error
      data {
        text
      }
    }
  }
`

export enum MutationExtractDocumentText {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationExtractDocumentText, DocumentNode> = {
    [MutationExtractDocumentText.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateExtractDocumentText}. */
export type MutateExtractDocumentTextParams = MutateParams<
    MutationExtractDocumentText,
    ExtractDocumentTextRequest
>

/**
 * Extracts plain text from an already-uploaded document (a CV file or a job
 * description file) by its storage key (pdf/docx/plain, server-side — NOT
 * persisted). The caller loads the returned text into the paste field for the
 * user to review before it feeds `splitCvFromText` / `tailorCvBlocks`.
 */
export const mutateExtractDocumentText = async ({
    mutation = MutationExtractDocumentText.Mutation1,
    request,
    debug,
    signal,
}: MutateExtractDocumentTextParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateExtractDocumentTextResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
