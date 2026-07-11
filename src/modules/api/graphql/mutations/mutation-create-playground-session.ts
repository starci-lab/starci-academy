import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CreatePlaygroundSessionRequest,
    MutateCreatePlaygroundSessionResponse,
} from "./types/create-playground-session"

const mutation1 = gql`
  mutation CreatePlaygroundSession($request: CreatePlaygroundSessionRequest!) {
    createPlaygroundSession(request: $request) {
      success
      message
      error
      data {
        id
        pairingCode
      }
    }
  }
`

export enum MutationCreatePlaygroundSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCreatePlaygroundSession, DocumentNode> = {
    [MutationCreatePlaygroundSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCreatePlaygroundSession}. */
export type MutateCreatePlaygroundSessionParams = MutateParams<
    MutationCreatePlaygroundSession,
    CreatePlaygroundSessionRequest
>

/**
 * Starts a Playground session for one exercise: persists a session row and
 * draws the short pairing code the learner enters into their local CLI agent
 * to connect it over the `/playground-byom` socket. Mirrors backend
 * `mutations/playground/create-playground-session`.
 */
export const mutateCreatePlaygroundSession = async ({
    mutation = MutationCreatePlaygroundSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateCreatePlaygroundSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateCreatePlaygroundSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
