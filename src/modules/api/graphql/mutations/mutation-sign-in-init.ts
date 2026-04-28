import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface SignInInitRequest {
    email: string
    password: string
}

export interface SignInInitData {
    challengeId: string
    expiresInSeconds: number
}

const mutation1 = gql`
  mutation SignInInit($request: SignInInitRequest!) {
    signInInit(request: $request) {
      success
      message
      error
      data {
        challengeId
        expiresInSeconds
      }
    }
  }
`

export enum MutationSignInInit {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignInInit, DocumentNode> = {
    [MutationSignInInit.Mutation1]: mutation1,
}

export type MutateSignInInitVariables = MutateVariables<SignInInitRequest>

export type MutateSignInInitParams = MutateParams<MutationSignInInit, SignInInitRequest>

export interface MutateSignInInitResponse {
    signInInit: GraphQLResponse<SignInInitData>
}

/**
 * Sign-in init: verifies username/password, then sends OTP to email.
 */
export const mutateSignInInit = async ({
    mutation = MutationSignInInit.Mutation1,
    request,
    debug,
    signal,
}: MutateSignInInitParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignInInitResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}

