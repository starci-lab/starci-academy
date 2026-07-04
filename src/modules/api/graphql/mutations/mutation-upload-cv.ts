import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { UploadCvRequest, MutateUploadCvResponse } from "./types/upload-cv"

const mutation1 = gql`
  mutation UploadCv($request: UploadCvRequest!) {
    uploadCv(request: $request) {
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

export enum MutationUploadCv {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationUploadCv, DocumentNode> = {
    [MutationUploadCv.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateUploadCv}. */
export type MutateUploadCvParams = MutateParams<MutationUploadCv, UploadCvRequest>

/**
 * Registers a CV the user UPLOADED (already PUT to storage via the presign flow)
 * into the unified `cv_generations` table as `source = uploaded`, then enqueues
 * async scoring. Returns the `jobId` to subscribe to and the `cvGenerationId`.
 */
export const mutateUploadCv = async ({
    mutation = MutationUploadCv.Mutation1,
    request,
    debug,
    signal,
    headers,
}: MutateUploadCvParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.mutate<MutateUploadCvResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
