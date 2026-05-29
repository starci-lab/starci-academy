import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Access the SWR mutation singleton for initiating the sign-in OTP flow.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSignInInitSwr = () => {
    const { mutateSignInInitSwr } = use(SwrContext)!
    return mutateSignInInitSwr
}

