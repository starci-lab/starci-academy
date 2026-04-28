import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

const mutation1 = gql`
  mutation SignOut {
    signOut {
      success
      message
      error
    }
  }
`

export enum MutationSignOut {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignOut, DocumentNode> = {
    [MutationSignOut.Mutation1]: mutation1,
}

export type MutateSignOutParams = MutateParams<MutationSignOut, void>

export interface MutateSignOutResponse {
    signOut: GraphQLResponse<void>
}

export const mutateSignOut = async ({
    mutation = MutationSignOut.Mutation1,
    debug,
    signal,
}: MutateSignOutParams) => {
    const apollo = createAuthApolloClient(
        {
            cache: false,
            debug,
            signal,
            withCredentials: true,
        }
    )
    return apollo.mutate<MutateSignOutResponse>({
        mutation: mutationMap[mutation],
    })
}
