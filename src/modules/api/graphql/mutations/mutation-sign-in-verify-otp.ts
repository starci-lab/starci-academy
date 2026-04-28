import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface SignInVerifyOtpRequest {
    challengeId: string
    otp: string
}

export interface SignInVerifyOtpData {
    accessToken: string
}

const mutation1 = gql`
  mutation SignInVerifyOtp($request: SignInVerifyOtpInput!) {
    signInVerifyOtp(request: $request) {
      success
      message
      error
      data {
        accessToken
      }
    }
  }
`

export enum MutationSignInVerifyOtp {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignInVerifyOtp, DocumentNode> = {
    [MutationSignInVerifyOtp.Mutation1]: mutation1,
}

export type MutateSignInVerifyOtpVariables = MutateVariables<SignInVerifyOtpRequest>

export type MutateSignInVerifyOtpParams = MutateParams<
    MutationSignInVerifyOtp,
    SignInVerifyOtpRequest
>

export interface MutateSignInVerifyOtpResponse {
    signInVerifyOtp: GraphQLResponse<SignInVerifyOtpData>
}

/**
 * Verifies OTP and completes sign-in.
 * Refresh token is set as HttpOnly cookie on the server; requires `withCredentials: true`.
 */
export const mutateSignInVerifyOtp = async ({
    mutation = MutationSignInVerifyOtp.Mutation1,
    request,
    debug,
    signal,
}: MutateSignInVerifyOtpParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignInVerifyOtpResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}

