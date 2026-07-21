import { createAuthApolloClient } from "../clients"
import { MutateParams } from "../types"
import { gql } from "@apollo/client"
import type {
    RenameContentAiSessionRequest,
    MutateRenameContentAiSessionResponse,
} from "./types/rename-content-ai-session"

const mutation = gql`
  mutation RenameContentAiSession($request: RenameContentAiSessionRequest!) {
    renameContentAiSession(request: $request) {
      success
      message
      error
      data {
        renamed
      }
    }
  }
`

/** Apollo params for {@link mutateRenameContentAiSession}. */
export type MutateRenameContentAiSessionParams = MutateParams<
    MutateRenameContentAiSessionResponse,
    RenameContentAiSessionRequest
>

export const mutateRenameContentAiSession = async ({
    request,
    debug,
    headers,
    signal,
}: MutateRenameContentAiSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        headers,
        signal,
    })
    const result = await apollo.mutate<MutateRenameContentAiSessionResponse>({
        mutation,
        variables: { request },
    })
    return result.data?.renameContentAiSession
}
