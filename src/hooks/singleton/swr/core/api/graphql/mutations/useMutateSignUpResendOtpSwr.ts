import type { AbortableRequest } from "@/modules/api"
import {
    mutateSignUpResendOtp,
    type SignUpResendOtpRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateSignUpResendOtpResult = Awaited<ReturnType<typeof mutateSignUpResendOtp>>

/**
 * SWR mutation for `signUpResendOtp` (resend OTP using existing `challengeId`).
 */
export const useMutateSignUpResendOtpSwrCore = () => {
    return useSWRMutation<
        MutateSignUpResendOtpResult,
        Error,
        string,
        AbortableRequest<SignUpResendOtpRequest>
    >(
        "MUTATE_SIGN_UP_RESEND_OTP_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateSignUpResendOtp({
                request: arg.request,
                signal: arg.signal,
            })
        },
    )
}
