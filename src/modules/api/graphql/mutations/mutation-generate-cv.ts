import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { GenerateCvRequest, MutateGenerateCvResponse } from "./types/generate-cv"

const mutation1 = gql`
  mutation GenerateCv($request: GenerateCvRequest!) {
    generateCv(request: $request) {
      success
      message
      error
      data {
        jobId
        cvGenerationId
      }
    }
  }
`

export enum MutationGenerateCv {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationGenerateCv, DocumentNode> = {
    [MutationGenerateCv.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateGenerateCv}. */
export type MutateGenerateCvParams = MutateParams<
    MutationGenerateCv,
    GenerateCvRequest
>

/**
 * Enqueues an AI CV-generation job from the learner's StarCi activity plus optional
 * free-text `extraPrompts`; returns the `jobId` to subscribe to and the `cvGenerationId`.
 */
export const mutateGenerateCv = async ({
    mutation = MutationGenerateCv.Mutation1,
    request,
    debug,
    signal,
    headers,
}: MutateGenerateCvParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.mutate<MutateGenerateCvResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
