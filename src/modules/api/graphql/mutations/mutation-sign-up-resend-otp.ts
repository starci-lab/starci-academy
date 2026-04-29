import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { SignUpInitData } from "./mutation-sign-up-init"

/**
 * Input for `signUpResendOtp` (matches server `SignUpResendOtpRequest`).
 */
export interface SignUpResendOtpRequest {
    challengeId: string
}

const mutation1 = gql`
  mutation SignUpResendOtp($request: SignUpResendOtpRequest!) {
    signUpResendOtp(request: $request) {
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

export enum MutationSignUpResendOtp {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignUpResendOtp, DocumentNode> = {
    [MutationSignUpResendOtp.Mutation1]: mutation1,
}

export type MutateSignUpResendOtpVariables = MutateVariables<SignUpResendOtpRequest>

export type MutateSignUpResendOtpParams = MutateParams<
    MutationSignUpResendOtp,
    SignUpResendOtpRequest
>

export interface MutateSignUpResendOtpResponse {
    signUpResendOtp: GraphQLResponse<SignUpInitData>
}

/**
 * Resend sign-up OTP for an existing challenge (same `challengeId` from `signUpInit`).
 */
export const mutateSignUpResendOtp = async ({
    mutation = MutationSignUpResendOtp.Mutation1,
    request,
    debug,
    signal,
}: MutateSignUpResendOtpParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignUpResendOtpResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
