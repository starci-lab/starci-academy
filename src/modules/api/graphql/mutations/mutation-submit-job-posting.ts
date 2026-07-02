import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SubmitJobPostingRequest,
    MutateSubmitJobPostingResponse,
} from "./types/job-postings"

const mutation1 = gql`
  mutation SubmitJobPosting($request: SubmitJobPostingRequest!) {
    submitJobPosting(request: $request) {
      success
      message
      error
      data
    }
  }
`

export enum MutationSubmitJobPosting {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSubmitJobPosting, DocumentNode> = {
    [MutationSubmitJobPosting.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSubmitJobPosting}. */
export type MutateSubmitJobPostingParams = MutateParams<
    MutationSubmitJobPosting,
    SubmitJobPostingRequest
>

/**
 * Submits a new job posting — requires login. Goes live immediately (no
 * approval workflow), `source = Submitted`. Mirrors `submitJobPosting`
 * (mutations/job-postings/submit-job-posting).
 */
export const mutateSubmitJobPosting = async ({
    mutation = MutationSubmitJobPosting.Mutation1,
    request,
    debug,
    signal,
}: MutateSubmitJobPostingParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateSubmitJobPostingResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
