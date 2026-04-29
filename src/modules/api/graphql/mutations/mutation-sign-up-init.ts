import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/**
 * Input for `signUpInit` (matches server `SignUpInitRequest`).
 */
export interface SignUpInitRequest {
    email: string
    password: string
    username?: string
    firstName?: string
    lastName?: string
}

export interface SignUpInitData {
    challengeId: string
    expiresInSeconds: number
}

const mutation1 = gql`
  mutation SignUpInit($request: SignUpInitRequest!) {
    signUpInit(request: $request) {
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

export enum MutationSignUpInit {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignUpInit, DocumentNode> = {
    [MutationSignUpInit.Mutation1]: mutation1,
}

export type MutateSignUpInitVariables = MutateVariables<SignUpInitRequest>

export type MutateSignUpInitParams = MutateParams<MutationSignUpInit, SignUpInitRequest>

export interface MutateSignUpInitResponse {
    signUpInit: GraphQLResponse<SignUpInitData>
}

/**
 * Sign-up init: creates Keycloak user and sends OTP to email (`signUpInit` mutation).
 */
export const mutateSignUpInit = async ({
    mutation = MutationSignUpInit.Mutation1,
    request,
    debug,
    signal,
}: MutateSignUpInitParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignUpInitResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
