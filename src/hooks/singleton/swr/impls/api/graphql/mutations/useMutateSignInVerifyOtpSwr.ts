import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

export const useMutateSignInVerifyOtpSwr = () => {
    const { mutateSignInVerifyOtpSwr } = use(SwrContext)!
    return mutateSignInVerifyOtpSwr
}

