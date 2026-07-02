import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { ReviseCvRequest, MutateReviseCvResponse } from "./types/revise-cv"

const mutation1 = gql`
  mutation ReviseCv($request: ReviseCvRequest!) {
    reviseCv(request: $request) {
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

export enum MutationReviseCv {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationReviseCv, DocumentNode> = {
    [MutationReviseCv.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateReviseCv}. */
export type MutateReviseCvParams = MutateParams<
    MutationReviseCv,
    ReviseCvRequest
>

/**
 * Enqueues an AI CV-revision job from an uploaded CV submission plus optional
 * free-text `extraPrompts`; returns the `jobId` to subscribe to and the `cvGenerationId`.
 */
export const mutateReviseCv = async ({
    mutation = MutationReviseCv.Mutation1,
    request,
    debug,
    signal,
    headers,
}: MutateReviseCvParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.mutate<MutateReviseCvResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
