import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { SignInInitData } from "./mutation-sign-in-init"

/**
 * Input for `signInResendOtp` (matches server `SignInResendOtpRequest`).
 */
export interface SignInResendOtpRequest {
    challengeId: string
}

const mutation1 = gql`
  mutation SignInResendOtp($request: SignInResendOtpRequest!) {
    signInResendOtp(request: $request) {
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

export enum MutationSignInResendOtp {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignInResendOtp, DocumentNode> = {
    [MutationSignInResendOtp.Mutation1]: mutation1,
}

export type MutateSignInResendOtpVariables = MutateVariables<SignInResendOtpRequest>

export type MutateSignInResendOtpParams = MutateParams<
    MutationSignInResendOtp,
    SignInResendOtpRequest
>

export interface MutateSignInResendOtpResponse {
    signInResendOtp: GraphQLResponse<SignInInitData>
}

/**
 * Resend sign-in OTP for an existing challenge (same `challengeId` from `signInInit`).
 */
export const mutateSignInResendOtp = async ({
    mutation = MutationSignInResendOtp.Mutation1,
    request,
    debug,
    signal,
}: MutateSignInResendOtpParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignInResendOtpResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
