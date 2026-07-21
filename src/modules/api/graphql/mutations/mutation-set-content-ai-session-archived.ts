import { createAuthApolloClient } from "../clients"
import { MutateParams } from "../types"
import { gql } from "@apollo/client"
import type {
    SetContentAiSessionArchivedRequest,
    MutateSetContentAiSessionArchivedResponse,
} from "./types/set-content-ai-session-archived"

const mutation = gql`
  mutation SetContentAiSessionArchived($request: SetContentAiSessionArchivedRequest!) {
    setContentAiSessionArchived(request: $request) {
      success
      message
      error
      data {
        archived
      }
    }
  }
`

/** Apollo params for {@link mutateSetContentAiSessionArchived}. */
export type MutateSetContentAiSessionArchivedParams = MutateParams<
    MutateSetContentAiSessionArchivedResponse,
    SetContentAiSessionArchivedRequest
>

export const mutateSetContentAiSessionArchived = async ({
    request,
    debug,
    headers,
    signal,
}: MutateSetContentAiSessionArchivedParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        headers,
        signal,
    })
    const result = await apollo.mutate<MutateSetContentAiSessionArchivedResponse>({
        mutation,
        variables: { request },
    })
    return result.data?.setContentAiSessionArchived
}
