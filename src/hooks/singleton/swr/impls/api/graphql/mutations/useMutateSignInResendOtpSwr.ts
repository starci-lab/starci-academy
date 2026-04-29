import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Reads `signInResendOtp` from {@link SwrContext}. Backend: `src/resend/resend/sign-in-resend-otp.resolver.ts`.
 */
export const useMutateSignInResendOtpSwr = () => {
    const { mutateSignInResendOtpSwr } = use(SwrContext)!
    return mutateSignInResendOtpSwr
}
