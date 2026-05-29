import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Access the SWR mutation singleton for verifying the sign-in OTP.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSignInVerifyOtpSwr = () => {
    const { mutateSignInVerifyOtpSwr } = use(SwrContext)!
    return mutateSignInVerifyOtpSwr
}

