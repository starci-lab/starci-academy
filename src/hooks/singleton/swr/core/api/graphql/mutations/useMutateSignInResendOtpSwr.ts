import type { AbortableRequest } from "@/modules/api"
import {
    mutateSignInResendOtp,
    type SignInResendOtpRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateSignInResendOtpResult = Awaited<ReturnType<typeof mutateSignInResendOtp>>

/**
 * SWR mutation for `signInResendOtp` (resend OTP using existing `challengeId`).
 */
export const useMutateSignInResendOtpSwrCore = () => {
    return useSWRMutation<
        MutateSignInResendOtpResult,
        Error,
        string,
        AbortableRequest<SignInResendOtpRequest>
    >(
        "MUTATE_SIGN_IN_RESEND_OTP_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateSignInResendOtp({
                request: arg.request,
                signal: arg.signal,
            })
        },
    )
}
