import { createNoAuthApolloClient } from "../clients"
import type { GraphQLResponse, MutateParams, MutateVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface SignUpVerifyOtpRequest {
    challengeId: string
    otp: string
}

export interface SignUpVerifyOtpData {
    accessToken: string
}

const mutation1 = gql`
  mutation SignUpVerifyOtp($request: SignUpVerifyOtpInput!) {
    signUpVerifyOtp(request: $request) {
      success
      message
      error
      data {
        accessToken
      }
    }
  }
`

export enum MutationSignUpVerifyOtp {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSignUpVerifyOtp, DocumentNode> = {
    [MutationSignUpVerifyOtp.Mutation1]: mutation1,
}

export type MutateSignUpVerifyOtpVariables = MutateVariables<SignUpVerifyOtpRequest>

export type MutateSignUpVerifyOtpParams = MutateParams<
    MutationSignUpVerifyOtp,
    SignUpVerifyOtpRequest
>

export interface MutateSignUpVerifyOtpResponse {
    signUpVerifyOtp: GraphQLResponse<SignUpVerifyOtpData>
}

/**
 * Verifies OTP and completes sign-up. Refresh token is set as HttpOnly cookie.
 */
export const mutateSignUpVerifyOtp = async ({
    mutation = MutationSignUpVerifyOtp.Mutation1,
    request,
    debug,
    signal,
}: MutateSignUpVerifyOtpParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateSignUpVerifyOtpResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
