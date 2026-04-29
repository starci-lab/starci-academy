import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Reads `signUpResendOtp` from {@link SwrContext}. Backend: `src/resend/resend copy/sign-up-resend-otp.resolver.ts`.
 */
export const useMutateSignUpResendOtpSwr = () => {
    const { mutateSignUpResendOtpSwr } = use(SwrContext)!
    return mutateSignUpResendOtpSwr
}
